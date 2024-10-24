import { SelectionInterface } from ".."

export const getSelectionXY: SelectionInterface['getSelectionXY'] = (editor) => {
    const { anchor, focus, anchorOffset, focusOffset } = editor.getSelection()
    const baseline = editor.getBaselines()
    if (!baseline) return [];
    const offsetAnchor = editor.getBaseLineCharacterOffset(anchor)![anchorOffset]
    const offsetFocus = editor.getBaseLineCharacterOffset(focus)![focusOffset]

    return [baseline[anchor].position.x + offsetAnchor, baseline[anchor].position.y, baseline[focus].position.x + offsetFocus, baseline[focus].position.y]
}
