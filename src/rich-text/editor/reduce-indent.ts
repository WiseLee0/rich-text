import { EditorInterface, fixIsFirstLineOfList } from "..";

export const reduceIndent: EditorInterface['reduceIndent'] = (editor) => {
    const { lines, characters } = editor.textData
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    const anchor = selectCharacterOffset?.anchor ?? 0
    const focus = selectCharacterOffset?.focus ?? characters.length
    if (!lines) return false;
    const anchorLineIdx = editor.getLineIndexForCharacterOffset(anchor)
    const focusLineIdx = editor.getLineIndexForCharacterOffset(focus)
    for (let i = anchorLineIdx; i < focusLineIdx + 1; i++) {
        lines[i].indentationLevel -= 1
        if (lines[i].lineType === 'PLAIN') {
            lines[i].indentationLevel = Math.max(lines[i].indentationLevel, 0)
        } else {
            lines[i].indentationLevel = Math.max(lines[i].indentationLevel, 1)
        }
    }
    fixIsFirstLineOfList(lines)
    editor.apply()
}