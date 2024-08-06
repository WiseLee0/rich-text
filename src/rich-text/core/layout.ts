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

export const layoutW: EditorInterface['layoutW'] = (editor, width) => {
    if (editor.style.textAutoResize === 'NONE') return editor.layout(width, editor.height)
    return editor.layout(width)
}

export const layoutH: EditorInterface['layoutH'] = (editor, height) => {
    return editor.layout(editor.width, height)
}