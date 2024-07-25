import { EditorInterface } from ".."

export const getFont: EditorInterface['getFont'] = (editor, family, style) => {
    const fonts = editor.fonMgr.get(family ?? '')
    return fonts?.find(item => item.subfamilyName === style)
}