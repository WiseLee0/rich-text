import { execEvent, SelectionInterface } from ".."

export const deselection: SelectionInterface['deselection'] = (editor) => {
    editor.__selection = {
        anchor: -1,
        focus: -1,
        anchorOffset: -1,
        focusOffset: -1
    }
    execEvent(editor, 'selection')
}
