import { EditorInterface, fontTokenize, setFontFeatures } from "..";

export const getMetrices: EditorInterface['getMetrices'] = (editor) => {
    if (editor.__metrices) return editor.__metrices

    const data = editor.textData
    const tokens = fontTokenize(data, editor.getText())
    if (!tokens.length) return;

    const { characterStyleIDs, styleOverrideTable } = data
    const styleMap = new Map<number, any>()
    if (styleOverrideTable) {
        for (let i = 0; i < styleOverrideTable.length; i++) {
            const styleOverride = styleOverrideTable[i];
            styleMap.set(styleOverride.styleID, styleOverride)
        }
    }

    editor.__truncation_metrice = new Map()
    editor.__metrices = []
    let tokenOffset = 0
    let firstCharacter = 0
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const style = styleMap.get(characterStyleIDs?.[tokenOffset] || -1)
        let family = style?.fontName?.family ?? editor.style.fontName?.family
        let fontStyle = style?.fontName?.style ?? editor.style.fontName?.style
        const font = editor.getFont(family, fontStyle)
        if (!font) continue

        // 省略号字符路径
        const styleKey = `${family}#${fontStyle}`
        if (editor.style.textTruncation === 'ENABLE' && !editor.__truncation_metrice.has(styleKey)) {
            const { glyphs, positions } = font.layout('.')
            const glyph = glyphs[0]
            const style = styleMap.get(characterStyleIDs?.[firstCharacter] || -1)
            const fontSize = style?.fontSize ?? editor.style.fontSize
            let unitsPerPx = fontSize / (font.unitsPerEm || 1000);
            const xAdvance = positions[0].xAdvance * unitsPerPx
            const height = (glyph as any).advanceHeight * unitsPerPx
            const capHeight = font.capHeight * unitsPerPx
            const ascent = font.ascent * unitsPerPx
            const path = glyph.path.scale(unitsPerPx, -unitsPerPx).toSVG()
            editor.__truncation_metrice.set(styleKey, {
                isLigature: false,
                codePoints: glyph.codePoints,
                path,
                xAdvance,
                ascent,
                capHeight,
                height,
                fontSize,
                name: '...',
                firstCharacter: -1
            })
        }


        const features = setFontFeatures(editor, tokenOffset)
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
            const capHeight = font.capHeight * unitsPerPx
            const path = isWrap ? '' : glyph.path.scale(unitsPerPx, -unitsPerPx).toSVG()

            editor.__metrices.push({
                isLigature: glyph.isLigature,
                codePoints: glyph.codePoints,
                path,
                xAdvance,
                ascent,
                height,
                fontSize,
                capHeight,
                name: isWrap ? '\n' : glyph.name,
                firstCharacter
            })
            firstCharacter += glyph.codePoints.length;
        }
        tokenOffset += token.length
    }

    return editor.__metrices;
}