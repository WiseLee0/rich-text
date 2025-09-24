import { EditorInterface, getTextArr } from "..";

let textWrapKey = ''
let textWrapValue: number[] = []
export const getLineIndexForCharacterOffset: EditorInterface['getLineIndexForCharacterOffset'] = (editor, firstCharacter) => {
    if (textWrapKey === editor.textData.characters) return textWrapValue[firstCharacter] ?? 0
    textWrapKey = editor.textData.characters;
    textWrapValue = []
    const textArr = getTextArr(editor)
    for (let i = 0; i < textArr.length; i++) {
        if (textArr[i] === '\n') textWrapValue[i] = (textWrapValue[i - 1] ?? 0) + 1;
        else textWrapValue[i] = textWrapValue[i - 1] ?? 0
    }
    return textWrapValue[firstCharacter] ?? 0
}