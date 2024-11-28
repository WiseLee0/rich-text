import { EditorInterface, Rect } from "..";

export const getTextDecorationRects: EditorInterface['getTextDecorationRects'] = (editor) => {
    const baselines = editor?.getBaselines()
    const glyphs = editor?.getGlyphs()
    const metrices = editor?.getMetrices()
    if (!baselines?.length || !glyphs?.length || !metrices?.length) return [];
    const rects: Rect[] = []
    for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        const metrice = metrices.find(item => item.firstCharacter === glyph.firstCharacter)
        if (!metrice) {
            rects.push([0, 0, 0, 0])
            continue
        }
        let textDecoration
        if (glyph.styleID !== undefined) {
            textDecoration = editor.getStyleForStyleID(glyph.styleID).textDecoration
        } else {
            textDecoration = editor.getStyle(glyph.firstCharacter, false).textDecoration
        }

        if (textDecoration === 'NONE') rects.push([0, 0, 0, 0])
        if (textDecoration === 'UNDERLINE') {
            rects.push([glyph.position.x, glyph.position.y + glyph.fontSize * 0.1, metrice.xAdvance, metrice.height / 24])
        }
        if (textDecoration === 'STRIKETHROUGH') {
            rects.push([glyph.position.x, glyph.position.y - glyph.fontSize * 0.3, metrice.xAdvance, metrice.height / 24])
        }
    }

    return rects
}