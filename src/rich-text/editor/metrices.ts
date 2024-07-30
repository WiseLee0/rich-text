import { EditorInterface, familyTokenize } from "..";

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
        const { glyphs, positions } = font.layout(token)
        const isWrap = token === '\n'
        for (let j = 0; j < glyphs.length; j++) {
            const glyph = glyphs[j]
            const style = styleMap.get(characterStyleIDs?.[familyTokenOffset + j] || -1)
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