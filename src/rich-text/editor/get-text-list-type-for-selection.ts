import { EditorInterface, getLineIndexForCharacterOffset, TextDataLinesInterface } from "..";

export const getTextListTypeForSelection: EditorInterface['getTextListTypeForSelection'] = (editor) => {
    const { lines } = editor.textData
    if (!lines) return '';
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    if (!selectCharacterOffset) {
        let type: TextDataLinesInterface['lineType'] | undefined
        for (let i = 0; i < lines.length; i++) {
            if (type && type !== lines[i].lineType) {
                return 'mix'
            }
            type = lines[i].lineType
        }

        return type!
    }

    const anchorLineIdx = getLineIndexForCharacterOffset(editor, selectCharacterOffset.anchor)
    const focusLineIdx = getLineIndexForCharacterOffset(editor, selectCharacterOffset.focus)
    let type: TextDataLinesInterface['lineType'] | undefined
    for (let i = anchorLineIdx; i < focusLineIdx + 1; i++) {
        if (type && type !== lines[i].lineType) {
            return 'mix'
        }
        type = lines[i].lineType
    }
    return type!
}   