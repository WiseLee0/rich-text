import { Editor, EditorInterface, familyTokenize } from "..";

export const getMetrices: EditorInterface['getMetrices'] = (editor) => {
    if (editor.__matrices) return editor.__matrices

    const data = editor.textData
    const familyTokens = familyTokenize(data, editor.getText())
    if (!familyTokens.length) return;

    const { characterStyleIDs, styleOverrideTable } = data
    const styleMap = new Map<number, any>()
    if (styleOverrideTable) {
        for (let i = 0; i < styleOverrideTable.length; i++) {
            const styleOverride = styleOverrideTable[i];
            styleMap.set(styleOverride.styleID, styleOverride)
        }
    }

    editor.__matrices = []
    let familyTokenOffset = 0
    let firstCharacter = 0
    for (let i = 0; i < familyTokens.length; i++) {
        const token = familyTokens[i];
        const style = styleMap.get(characterStyleIDs?.[familyTokenOffset] || -1)
        let family = style?.fontName?.family ?? editor.style.fontName?.family
        let fontStyle = style?.fontName?.style ?? editor.style.fontName?.style
        const font = editor.getFont(family, fontStyle)
        if (!font) continue
        const features = getLayoutFeatures(editor)
        const { glyphs, positions } = font.layout(token, features)
        const isWrap = token === '\n'
        for (let j = 0; j < glyphs.length; j++) {
            const glyph = glyphs[j]
            const style = styleMap.get(characterStyleIDs?.[firstCharacter] || -1)
            const fontSize = style?.fontSize ?? editor.style.fontSize
            let unitsPerPx = fontSize / (font.unitsPerEm || 1000);
            const xAdvance = isWrap ? 0 : positions[j].xAdvance * unitsPerPx
            const height = (glyph as any).advanceHeight * unitsPerPx
            const ascent = font.ascent * unitsPerPx
            const path = isWrap ? '' : glyph.path.scale(unitsPerPx, -unitsPerPx).toSVG()

            editor.__matrices.push({
                isLigature: glyph.isLigature,
                codePoints: glyph.codePoints,
                path,
                xAdvance,
                ascent,
                height,
                fontSize,
                name: isWrap ? '\n' : glyph.name,
                firstCharacter
            })
            firstCharacter += glyph.codePoints.length;
        }
        familyTokenOffset += token.length
    }

    return editor.__matrices;
}

const getLayoutFeatures = (editor: Editor) => {
    const feature = {
        // 在特定字符对之间调整字符间距，以确保视觉上的均衡和美观
        kern: true,
        // 标准连字，如 "fi"、"fl" 等，通常用于日常排版
        liga: true,
        // 上下文连字，根据特定的上下文条件出现的连字
        clig: true,
        // 必需连字，在特定语言或排版情况下必须使用的连字
        rlig: true,
        // 基本上下文替代，根据字符的上下文自动替换为更适合的字形
        calt: true,
        // 必需的上下文替代，在特定语言规则下必须进行的替换
        rclt: true,
        // 字形的合成和分解，用于处理复合字符或分解字符
        ccmp: true,
        // 与光标相关的特性，用于在编辑或显示文本时处理光标位置
        cursor: true,
        // 本地化表单，根据不同的语言或区域替换为适合特定语言的字形
        locl: true,
        // 标记定位，用于精确定位附加标记（如重音符号）的位置
        mark: true,
        // 标记到标记定位，用于定位一个标记相对于另一个标记的位置
        mkmk: true
    }
    const style = editor.getStyle(true)
    style.toggledOffOTFeatures?.map(item => {
        const key = item.toLowerCase();
        (feature as any)[key] = false;
    })
    return feature
}