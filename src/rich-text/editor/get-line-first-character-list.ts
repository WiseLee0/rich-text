import { EditorInterface, getTextArr } from "..";

let lineFirstCharacterListKey = ''
let lineFirstCharacterListValue: number[] = []
export const getLineFirstCharacterList: EditorInterface['getLineFirstCharacterList'] = (editor) => {
    if (lineFirstCharacterListKey === editor.textData.characters) return lineFirstCharacterListValue
    const text = getTextArr(editor)
    lineFirstCharacterListKey = editor.textData.characters;
    lineFirstCharacterListValue = []
    let flag = true
    for (let i = 0; i < text.length; i++) {
        if (flag) {
            lineFirstCharacterListValue.push(i)
            flag = false
        }
        if (text[i] === '\n') flag = true
    }
    return lineFirstCharacterListValue;
}