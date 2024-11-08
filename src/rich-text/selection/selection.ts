import { clearGetStyleCache, execEvent, SelectionInterface } from '..'

export const setSelection: SelectionInterface['setSelection'] = (editor, range) => {

    clearGetStyleCache(editor)

    editor.__selection = {
        ...editor.__selection,
        ...range
    }
    execEvent(editor, 'selection')
}

export const getSelection: SelectionInterface['getSelection'] = (editor) => {
    const temp = editor.__selection
    if ((temp.anchor > temp.focus) || (temp.anchor === temp.focus && temp.anchorOffset > temp.focusOffset)) {
        return {
            anchor: temp.focus,
            anchorOffset: temp.focusOffset,
            focus: temp.anchor,
            focusOffset: temp.anchorOffset
        }
    }
    return { ...temp }
}