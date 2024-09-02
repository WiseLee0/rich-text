import { EditorInterface, getTextArr } from "..";

export const getLineIndexForCharacterOffset: EditorInterface['getLineIndexForCharacterOffset'] = (editor, firstCharacter) => {
    const text = getTextArr(editor)
    let lineIdx = 0
    for (let i = 0; i < firstCharacter; i++) {
        if (text[i] === '\n') lineIdx++
    }
    return lineIdx;
}