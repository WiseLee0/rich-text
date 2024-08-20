import { EditorInterface, fontTokenize, getStyleForStyleID, setFontFeatures, StyleInterface } from "..";

export const getMetrices: EditorInterface['getMetrices'] = (editor) => {
    if (editor.__metrices) return editor.__metrices

    const data = editor.textData
    const tokens = fontTokenize(data, editor.getText())
    if (!tokens.length) return;

    const { characterStyleIDs } = data

    editor.__metrices = []
    let tokenOffset = 0
    let firstCharacter = 0
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const style = getStyleForStyleID(editor, characterStyleIDs?.[tokenOffset])
        let family = style.fontName.family
        let fontStyle = style.fontName.style
        const font = editor.getFont(family, fontStyle)

        if (!font) continue

        const features = setFontFeatures(editor, tokenOffset)
        const { glyphs, positions } = font.layout(token, features)

        const isWrap = token === '\n'
        for (let j = 0; j < glyphs.length; j++) {
            const glyph = glyphs[j]
            const style = getStyleForStyleID(editor, characterStyleIDs?.[firstCharacter])
            const fontSize = style.fontSize
            let unitsPerPx = fontSize / (font.unitsPerEm || 1000);
            let xAdvance = 0
            let letterSpacing = 0
            let name = '\n'
            if (!isWrap) {
                letterSpacing = getLetterSpacing(style)
                xAdvance = positions[j].xAdvance * unitsPerPx + letterSpacing
                name = glyph.name
            }
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
                name,
                letterSpacing,
                firstCharacter
            })
            firstCharacter += glyph.codePoints.length;
        }
        tokenOffset += token.length
    }

    return editor.__metrices;
}

const getLetterSpacing = (style: StyleInterface) => {
    if (style.letterSpacing?.units === 'PERCENT') {
        return (style.letterSpacing.value / 100) * style.fontSize
    }
    return style.letterSpacing.value
}