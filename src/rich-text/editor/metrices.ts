import { checkFontSupport, EditorInterface, getLangFont, fontTokenize, getStyleForStyleID, setFontFeatures, StyleInterface, loadLangFont } from "..";

const allLackURLSet = new Set<string>()
export const getMetrices: EditorInterface['getMetrices'] = (editor) => {
    if (editor.__metrices) return editor.__metrices

    const data = editor.textData
    const tokens = fontTokenize(data, editor.getText())
    if (!tokens.length) return;

    const { characterStyleIDs } = data

    editor.__metrices = []
    let tokenOffset = 0
    let firstCharacter = 0
    const lackFontURLSet = new Set<string>()
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const style = getStyleForStyleID(editor, characterStyleIDs?.[tokenOffset])
        let family = style.fontName.family
        let fontStyle = style.fontName.style
        const fontVariations = style.fontVariations
        let originFont = editor.getFont(family, fontStyle)
        if (Object.keys(fontVariations)?.length) originFont = originFont?.getVariation(fontVariations)

        if (!originFont) continue

        const features = setFontFeatures(editor, tokenOffset)
        const { glyphs, positions } = originFont.layout(token, features)

        const isWrap = token === '\n'
        let tokenIdx = 0
        for (let j = 0; j < glyphs.length; j++) {
            let font = originFont
            let glyph = glyphs[j]
            let position = positions[j]
            let supportLang = true

            // 检测当前字体是否支持渲染
            if (!isWrap && !checkFontSupport(font, glyph.codePoints) && token[tokenIdx]) {
                const [langFont, url] = getLangFont(editor, token[tokenIdx], { originFont, fontStyle, fontVariations })
                if (langFont) {
                    font = langFont
                    const newLayout = font.layout(token[tokenIdx])
                    glyph = newLayout.glyphs[0]
                    position = newLayout.positions[0]
                } else {
                    lackFontURLSet.add(url)
                    supportLang = false
                }
            }
            const style = getStyleForStyleID(editor, characterStyleIDs?.[firstCharacter])
            const fontSize = style.fontSize
            let unitsPerPx = fontSize / (font.unitsPerEm || 1000);
            let xAdvance = 0
            let letterSpacing = 0
            let name = '\n'
            if (!isWrap) {
                letterSpacing = getLetterSpacing(style)
                xAdvance = position.xAdvance * unitsPerPx + letterSpacing
                name = glyph.name
            }
            const height = ((glyph as any).advanceHeight || (font.ascent - font.descent)) * unitsPerPx
            const ascent = font.ascent * unitsPerPx
            const capHeight = font.capHeight * unitsPerPx
            const path = (isWrap || !supportLang) ? '' : glyph.path.scale(unitsPerPx, -unitsPerPx).toSVG()

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
                firstCharacter,
            })
            firstCharacter += glyph.codePoints.length;
            tokenIdx += glyph.codePoints.length;
        }
        tokenOffset += token.length
    }

    // 加载缺失字体
    if (lackFontURLSet.size) {
        for (const url of lackFontURLSet) {
            if (!allLackURLSet.has(url)) {
                allLackURLSet.add(url)
                loadLangFont(editor, url)
            }
        }
    }


    return editor.__metrices;
}

const getLetterSpacing = (style: StyleInterface) => {
    if (style.letterSpacing?.units === 'PERCENT') {
        return (style.letterSpacing.value / 100) * style.fontSize
    }
    return style.letterSpacing.value
}