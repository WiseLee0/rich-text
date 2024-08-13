import { Editor, EditorInterface, FillPaintType } from "..";


export const getFillPaintsForGlyphs: EditorInterface['getFillPaintsForGlyphs'] = (editor) => {
    const glyphs = editor.getGlyphs()
    if (!glyphs?.length) return []
    const result: FillPaintType[][] = []
    for (let i = 0; i < glyphs?.length; i++) {
        const glyph = glyphs[i]
        let firstCharacter = glyph.firstCharacter
        let fillPaints = editor.getFillPaintsForGlyph(firstCharacter)
        if (firstCharacter === undefined) {
            for (let j = i + 1; j < glyphs?.length; j++) {
                firstCharacter = glyphs[j].firstCharacter
                if (firstCharacter !== undefined) {
                    fillPaints = editor.getLineStyleForCharacterOffset(firstCharacter).fillPaints
                    break
                }
            }
        }
        result.push(fillPaints)
    }
    return result
}

export const getFillPaintsForGlyph: EditorInterface['getFillPaintsForGlyph'] = (editor, firstCharacter) => {
    const { fillPaints } = editor.style
    if (!fillPaints.length || firstCharacter === undefined) return []
    const { characterStyleIDs, styleOverrideTable } = editor.textData
    const styleID = characterStyleIDs?.[firstCharacter]
    if (!styleID || !styleOverrideTable?.length) return fillPaints
    return styleOverrideTable.find(item => item.styleID === styleID)?.fillPaints ?? fillPaints
}