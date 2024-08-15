import { EditorInterface, fixIsFirstLineOfList, TextDataLinesInterface } from "..";

export const setTextList: EditorInterface['setTextList'] = (editor, lineType) => {
    const { lines, characters } = editor.textData
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    const anchor = selectCharacterOffset?.anchor ?? 0
    const focus = selectCharacterOffset?.focus ?? characters.length
    if (!lines) return false;
    const anchorLineIdx = editor.getLineIndexForCharacterOffset(anchor)
    const focusLineIdx = editor.getLineIndexForCharacterOffset(focus)

    for (let i = anchorLineIdx; i < focusLineIdx + 1; i++) {
        const line = lines[i];
        line.lineType = lineType
        if (lineType === 'PLAIN') {
            line.indentationLevel = 0
            continue;
        }
        if (line.indentationLevel === 0) {
            line.indentationLevel = 1
        }
    }

    fixIsFirstLineOfList(lines)

    editor.apply()
}