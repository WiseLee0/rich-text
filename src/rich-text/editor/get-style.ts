import { deepClone, EditorInterface, StyleInterface } from "..";

export const getStyle: EditorInterface['getStyle'] = (editor, firstCharacter, needClone = true) => {
    if (firstCharacter === undefined) {
        return needClone ? deepClone(editor.style) : editor.style
    }
    const { characterStyleIDs, styleOverrideTable } = editor.textData
    const styleID = characterStyleIDs?.[firstCharacter]
    const style = styleOverrideTable?.find(item => item.styleID === styleID)
    return needClone ? deepClone({ ...editor.style, ...style }) as StyleInterface : { ...editor.style, ...style };
}