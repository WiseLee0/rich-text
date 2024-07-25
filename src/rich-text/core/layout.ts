import { EditorInterface } from ".."

export const layout: EditorInterface['layout'] = (editor, width, height) => {
    if (width === undefined && height === undefined) {
        editor.style.textAutoResize = 'WIDTH_AND_HEIGHT'
    }
    if (width !== undefined && height === undefined) {
        editor.style.textAutoResize = 'HEIGHT'
        editor.width = width
    }
    if (width !== undefined && height !== undefined) {
        editor.style.textAutoResize = 'NONE'
        editor.width = width
        editor.height = height
    }
    return editor.apply()
}
