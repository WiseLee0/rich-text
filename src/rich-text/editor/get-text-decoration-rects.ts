import { EditorInterface, Rect } from "..";

export const getTextDecorationRects: EditorInterface['getTextDecorationRects'] = (editor) => {
    const baselines = editor?.getBaselines()
    const glyphs = editor?.getGlyphs()
    if (!baselines?.length || !glyphs?.length) return [];
    const rects: Rect[] = []
    let character = 0
    for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        character = glyph?.firstCharacter || character
        const baseline = baselines.find(item => item.firstCharacter <= character && item.endCharacter > character)
        const height = baseline?.lineHeight || glyph.fontSize
        if (glyph?.xAdvance === undefined) {
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
            rects.push([glyph.position.x, glyph.position.y + glyph.fontSize * 0.1, glyph.xAdvance, height / 24])
        }
        if (textDecoration === 'STRIKETHROUGH') {
            rects.push([glyph.position.x, glyph.position.y - glyph.fontSize * 0.3, glyph.xAdvance, height / 24])
        }
    }

    return rects
}