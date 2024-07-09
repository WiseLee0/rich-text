import { EditorInterface } from "..";

export const getText: EditorInterface['getText'] = (editor) => {
    return editor.textData.characters
}