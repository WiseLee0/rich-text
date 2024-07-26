import { EditorInterface } from "..";

export const setStyle: EditorInterface['setStyle'] = (editor, style) => {
    if (style.fontName) {
        style.fontVariations = []
    }
    editor.style = {
        ...editor.style,
        ...style
    }
}