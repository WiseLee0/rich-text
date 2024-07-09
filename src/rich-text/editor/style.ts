import { EditorInterface } from "..";

export const setStyle: EditorInterface['setStyle'] = (editor, style) => {
    editor.style = {
        ...editor.style,
        ...style
    }
}