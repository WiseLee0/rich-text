import { SelectionInterface } from ".."

export const isCollapse: SelectionInterface['isCollapse'] = (editor) => {
    const { anchor, focus } = editor.selection
    return anchor[0] === focus[0] && anchor[1] === focus[1] && anchor[0] >= 0
}