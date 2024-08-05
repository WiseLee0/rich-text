import { EditorInterface } from "..";

export const getFillPaintsForGlyph: EditorInterface['getFillPaintsForGlyph'] = (editor, firstCharacter) => {
    const { fillPaints } = editor.style
    if (!fillPaints.length || firstCharacter === undefined) return []
    const { characterStyleIDs, styleOverrideTable } = editor.textData
    const styleID = characterStyleIDs?.[firstCharacter]
    if (!styleID || !styleOverrideTable?.length) return fillPaints
    return styleOverrideTable.find(item => item.styleID === styleID)?.fillPaints ?? fillPaints
}