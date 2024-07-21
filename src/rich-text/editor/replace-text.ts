import { EditorInterface } from "..";

export const replaceText: EditorInterface['replaceText'] = (editor, text) => {
    editor.textData.characters = text;
}