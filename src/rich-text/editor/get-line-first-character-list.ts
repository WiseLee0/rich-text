import { EditorInterface } from "..";

export const getLineFirstCharacterList: EditorInterface['getLineFirstCharacterList'] = (editor) => {
    const text = editor.textData.characters
    const firstCharacterArr = []
    let flag = true
    for (let i = 0; i < text.length; i++) {
        if (flag) {
            firstCharacterArr.push(i)
            flag = false
        }
        if (text[i] === '\n') flag = true
    }
    return firstCharacterArr;
}