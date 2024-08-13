import { deepClone, EditorInterface, StyleInterface } from "..";

export const getStyle: EditorInterface['getStyle'] = (editor, firstCharacter) => {
    if (firstCharacter === undefined) {
        return deepClone(editor.style)
    }
    const { characterStyleIDs, styleOverrideTable } = editor.textData
    const styleID = characterStyleIDs?.[firstCharacter]
    const style = styleOverrideTable?.find(item => item.styleID === styleID)
    return deepClone({ ...editor.style, ...style }) as StyleInterface;
}