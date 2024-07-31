import { EditorInterface, MetricesInterface, Rect } from "..";

export const getTextDecorationRects: EditorInterface['getTextDecorationRects'] = (editor) => {
    const baselines = editor?.getBaselines()
    const glyphs = editor?.getGlyphs()
    const metrices = editor?.getMetrices()
    if (!baselines?.length || !glyphs?.length || !metrices?.length) return [];
    const style = editor.getStyle(true)
    const { textDecoration } = style
    const { styleOverrideTable, characterStyleIDs } = editor.textData
    if (textDecoration === 'NONE') return []
    const rects: Rect[] = []
    if (!characterStyleIDs?.length || !styleOverrideTable?.length) {
        if (textDecoration === 'UNDERLINE') {
            for (let i = 0; i < baselines?.length; i++) {
                const baseline = baselines[i];
                rects.push([baseline.position.x, baseline.lineY + baseline.lineHeight * 0.9, Math.min(baseline.width, editor.width), baseline.lineHeight / 24])
            }
        }

        if (textDecoration === 'STRIKETHROUGH') {
            for (let i = 0; i < baselines?.length; i++) {
                const baseline = baselines[i];
                rects.push([baseline.position.x, baseline.lineY + baseline.lineHeight * 0.6, Math.min(baseline.width, editor.width), baseline.lineHeight / 24])
            }
        }
        return rects
    }
    const metricesMap = new Map<number, MetricesInterface>()
    for (let i = 0; i < metrices.length; i++) {
        const metrice = metrices[i];
        metricesMap.set(metrice.firstCharacter, metrice)
    }
    const styleOverrideTableMap = new Map<number, any>()
    for (let i = 0; i < styleOverrideTable.length; i++) {
        const { styleID, ...rest } = styleOverrideTable[i]
        styleOverrideTableMap.set(styleID, rest)
    }

    for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        const metrice = metricesMap.get(glyph.firstCharacter)
        if (!metrice) {
            console.warn('getTextDecorationRects exception')
            continue
        }
        const styleID = characterStyleIDs[glyph.firstCharacter]
        const textDecoration = styleOverrideTableMap.get(styleID)?.textDecoration ?? style?.textDecoration
        if (textDecoration === 'NONE') continue
        if (textDecoration === 'UNDERLINE') {
            rects.push([glyph.position.x, glyph.position.y + metrice.height * 0.1, metrice.xAdvance, metrice.height / 24])
        }
        if (textDecoration === 'STRIKETHROUGH') {
            rects.push([glyph.position.x, glyph.position.y - metrice.height * 0.2, metrice.xAdvance, metrice.height / 24])
        }
    }

    return rects
}