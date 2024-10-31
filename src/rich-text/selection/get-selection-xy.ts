import { SelectionInterface } from ".."

export const getSelectionXY: SelectionInterface['getSelectionXY'] = (editor) => {
    const { anchor, focus, anchorOffset, focusOffset } = editor.getSelection()
    const baseline = editor.getBaselines()
    if (!baseline?.length) {
        return [0, 0, 0, 0];
    }
    if (anchor === baseline.length && anchor === focus) {
        return [baseline[anchor - 1].position.x, baseline[anchor - 1].lineHeight + baseline[anchor - 1].lineY + baseline[anchor - 1].lineAscent, baseline[anchor - 1].position.x, baseline[anchor - 1].lineHeight + baseline[anchor - 1].lineY + baseline[anchor - 1].lineAscent]
    }
    const offsetAnchor = editor.getBaseLineCharacterOffset(anchor)![anchorOffset]
    const offsetFocus = editor.getBaseLineCharacterOffset(focus)![focusOffset]
    if (offsetAnchor === undefined || offsetFocus === undefined) {
        return [0, 0, 0, 0];
    }
    return [baseline[anchor].position.x + offsetAnchor, baseline[anchor].position.y, baseline[focus].position.x + offsetFocus, baseline[focus].position.y]
}
