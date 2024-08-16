import { EditorInterface, fixTextDataLines, getLineIndexForCharacterOffset } from "..";

export const setTextList: EditorInterface['setTextList'] = (editor, lineType, listStartOffset) => {
    const { lines, characters } = editor.textData
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    const anchor = selectCharacterOffset?.anchor ?? 0
    const focus = selectCharacterOffset?.focus ?? characters.length
    if (!lines) return false;
    const anchorLineIdx = getLineIndexForCharacterOffset(editor, anchor)
    const focusLineIdx = getLineIndexForCharacterOffset(editor, focus)

    for (let i = anchorLineIdx; i < focusLineIdx + 1; i++) {
        const line = lines[i];
        line.lineType = lineType
        line.listStartOffset = listStartOffset ?? 0
        if (lineType === 'PLAIN') {
            line.indentationLevel = 0
            continue;
        }
        if (line.indentationLevel === 0) {
            line.indentationLevel = 1
        }
    }

    fixTextDataLines(lines)

    editor.apply()
}