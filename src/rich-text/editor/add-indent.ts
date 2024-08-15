import { EditorInterface, fixIsFirstLineOfList } from "..";

export const addIndent: EditorInterface['addIndent'] = (editor) => {
    const { lines, characters } = editor.textData
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    const anchor = selectCharacterOffset?.anchor ?? 0
    const focus = selectCharacterOffset?.focus ?? characters.length
    if (!lines) return false;
    const anchorLineIdx = editor.getLineIndexForCharacterOffset(anchor)
    const focusLineIdx = editor.getLineIndexForCharacterOffset(focus)
    for (let i = anchorLineIdx; i < focusLineIdx + 1; i++) {
        lines[i].indentationLevel += 1
        if (lines[i].lineType === 'PLAIN') {
            lines[i].indentationLevel = Math.min(lines[i].indentationLevel, 5)
        } else {
            lines[i].indentationLevel = Math.min(lines[i].indentationLevel, 6)
        }
    }
    fixIsFirstLineOfList(lines)
    editor.apply()
}