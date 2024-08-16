import { EditorInterface, FillPaintType } from "..";


export const getFillPaintsForGlyphs: EditorInterface['getFillPaintsForGlyphs'] = (editor) => {
    const glyphs = editor.getGlyphs()
    if (!glyphs?.length) return []
    const result: FillPaintType[][] = []
    for (let i = 0; i < glyphs?.length; i++) {
        const glyph = glyphs[i]
        const firstCharacter = glyph.firstCharacter
        let fillPaints: FillPaintType[];
        if (glyph.styleID !== undefined) {
            fillPaints = editor.getStyleForStyleID(glyph.styleID).fillPaints
        } else {
            fillPaints = getFillPaintsForGlyph(editor, firstCharacter)
        }
        result.push(fillPaints)
    }
    return result
}

const getFillPaintsForGlyph: EditorInterface['getFillPaintsForGlyph'] = (editor, firstCharacter) => {
    const { fillPaints } = editor.style
    if (!fillPaints.length || firstCharacter === undefined) return []
    const { characterStyleIDs, styleOverrideTable } = editor.textData
    const styleID = characterStyleIDs?.[firstCharacter]
    if (!styleID || !styleOverrideTable?.length) return fillPaints
    return styleOverrideTable.find(item => item.styleID === styleID)?.fillPaints ?? fillPaints
}