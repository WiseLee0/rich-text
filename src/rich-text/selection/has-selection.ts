import { SelectionInterface } from ".."

export const hasSelection: SelectionInterface['hasSelection'] = (editor) => {
    const { anchor, focus, anchorOffset, focusOffset } = editor.getSelection()
    return anchor >= 0 && focus >= 0 && anchorOffset >= 0 && focusOffset >= 0
}
