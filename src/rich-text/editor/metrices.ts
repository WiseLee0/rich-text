import { checkFontSupport, EditorInterface, getLangFont, fontTokenize, getStyleForStyleID, setFontFeatures, StyleInterface, loadLangFont, detectEmoji, getCodePoints, loadFontMetaURL } from "..";

const allLackURLSet = new Set<string>()
export const getMetrices: EditorInterface['getMetrices'] = (editor) => {
    if (editor.__metrices) return editor.__metrices

    const data = editor.textData
    const tokens = fontTokenize(data, editor.getText())
    if (!tokens.length) return;

    const { characterStyleIDs } = data

    editor.__metrices = []
    let firstCharacter = 0
    const lackFontURLSet = new Set<string>()
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const isEmoji = detectEmoji(token)
        const style = getStyleForStyleID(editor, characterStyleIDs?.[firstCharacter])
        let family = style.fontName.family
        let fontStyle = style.fontName.style
        const fontVariations = style.fontVariations
        let originFont = editor.getFont(family, fontStyle)
        if (Object.keys(fontVariations)?.length) originFont = originFont?.getVariation(fontVariations)

        if (!originFont) {
            loadFontMetaURL(editor, style.fontName)
            originFont = editor.getFont('Inter', 'Regular')!;
        }

        const features = setFontFeatures(editor, firstCharacter)
        const { glyphs, positions } = originFont.layout(token, features)

        if (!glyphs.length) {
            const codePoints = getCodePoints(token)
            editor.__metrices.push({
                isLigature: false,
                codePoints,
                path: '',
                xAdvance: 0,
                ascent: 0,
                height: 0,
                fontSize: 0,
                capHeight: 0,
                name: '',
                letterSpacing: 0,
                firstCharacter,
            })
            firstCharacter += codePoints.length;
            continue
        }
        const isWrap = token === '\n'
        let tokenIdx = 0
        for (let j = 0; j < glyphs.length; j++) {
            let font = originFont
            let glyph = glyphs[j]
            let position = positions[j]
            let supportLang = true

            // 检测当前字体是否支持字符渲染
            if (!isEmoji && !isWrap && !checkFontSupport(font, glyph.codePoints) && token[tokenIdx]) {
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
            let isLigature = glyph.isLigature
            let codePoints = glyph.codePoints
            const height = ((glyph as any).advanceHeight || (font.ascent - font.descent)) * unitsPerPx
            let ascent = font.ascent * unitsPerPx
            const capHeight = font.capHeight * unitsPerPx
            let path = (isWrap || !supportLang) ? '' : glyph.path.scale(unitsPerPx, -unitsPerPx).toSVG()
            if (!isWrap) {
                letterSpacing = getLetterSpacing(style)
                xAdvance = position.xAdvance * unitsPerPx + letterSpacing
                name = glyph.name
            }
            // 空格修改名称
            if (glyph.codePoints.length === 1 && glyph.codePoints[0] === 32) {
                name = 'space'
            }
            if (isEmoji) {
                name = 'isEmoji'
                path = ''
                codePoints = getCodePoints(token)
                isLigature = false
                xAdvance = fontSize
                ascent = fontSize
            }

            editor.__metrices.push({
                isLigature,
                codePoints,
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

            firstCharacter += codePoints.length;
            tokenIdx += codePoints.length;
            if (isEmoji) break
        }
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