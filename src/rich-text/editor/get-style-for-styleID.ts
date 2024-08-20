import { deepClone, EditorInterface, StyleInterface } from "..";

export const getStyleForStyleID: EditorInterface['getStyleForStyleID'] = (editor, styleID, needClone = true) => {
    if (!styleID) {
        return needClone ? deepClone(editor.style) : editor.style
    }
    const { styleOverrideTable } = editor.textData
    const style = styleOverrideTable?.find(item => item.styleID === styleID)
    const result = { ...editor.style, ...style }
    return needClone ? deepClone(result) as StyleInterface : result;
}