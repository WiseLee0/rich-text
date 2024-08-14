import { deepClone, EditorInterface, StyleInterface } from "..";

export const getStyleForStyleID: EditorInterface['getStyleForStyleID'] = (editor, styleID) => {
    if (!styleID) {
        return deepClone(editor.style)
    }
    const { styleOverrideTable } = editor.textData
    const style = styleOverrideTable?.find(item => item.styleID === styleID)
    return deepClone({ ...editor.style, ...style }) as StyleInterface;
}