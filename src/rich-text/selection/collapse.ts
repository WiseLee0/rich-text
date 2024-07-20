import { SelectionInterface } from ".."

export const isCollapse: SelectionInterface['isCollapse'] = (editor) => {
    const { anchor, focus, anchorOffset, focusOffset } = editor.getSelection()
    return anchor === focus && anchorOffset === focusOffset
}