import { SelectionInterface } from "..";

export const getAnchorAndFocusOffset: SelectionInterface['getAnchorAndFocusOffset'] = (editor) => {
    const baselines = editor.getBaselines()
    const metrices = editor.getMetrices()
    if (!metrices || !baselines || !editor.hasSelection()) return;
    const { focus, anchor } = editor.selection

    const focusOffset = baselines[focus[0]].firstCharacter + focus[1]
    const anchorOffset = baselines[anchor[0]].firstCharacter + anchor[1]

    return {
        focusOffset,
        anchorOffset
    }
}

export const translateSelection: SelectionInterface['translateSelection'] = (editor, distance) => {
    if (!editor.isCollapse()) return
    const select = editor.selection.anchor
    const newRange = [select[0], select[1] + distance] as [number, number];
    editor.setSelection({
        anchor: newRange,
        focus: newRange,
    })
    editor.fixSelection()
}