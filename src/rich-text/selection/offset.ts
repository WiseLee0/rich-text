import { Editor, SelectionInterface } from "..";

export const getAnchorAndFocusOffset: SelectionInterface['getAnchorAndFocusOffset'] = (editor) => {
    const baselines = editor.getBaselines()
    const metrices = editor.getMetrices()
    if (!metrices?.length || !baselines?.length || !editor.hasSelection()) return;
    const { focus, anchor } = editor.selection

    let focusFirstCharacter = 0
    let anchorFirstCharacter = 0
    if (focus[0] === baselines.length) {
        focusFirstCharacter = baselines[baselines.length - 1].endCharacter
    } else if (focus[0] < baselines.length) {
        focusFirstCharacter = baselines[focus[0]].firstCharacter
    } else {
        console.warn('getAnchorAndFocusOffset exception')
    }
    if (anchor[0] === baselines.length) {
        anchorFirstCharacter = baselines[baselines.length - 1].endCharacter
    } else if (anchor[0] < baselines.length) {
        anchorFirstCharacter = baselines[anchor[0]].firstCharacter
    } else {
        console.warn('getAnchorAndFocusOffset exception')
    }

    const focusOffset = focusFirstCharacter + focus[1]
    const anchorOffset = anchorFirstCharacter + anchor[1]

    return {
        focusOffset,
        anchorOffset
    }
}

export const setSelectionOffset: SelectionInterface['setSelectionOffset'] = (editor, offset) => {
    if (!editor.isCollapse()) return
    const baselines = editor.getBaselines()
    if (!baselines?.length) return;
    const idx = baselines.findIndex(item => item.firstCharacter <= offset && item.endCharacter > offset)
    const newRange = [0, 0] as [number, number];
    const text = editor.getText()
    const lastBaseline = baselines[baselines.length - 1]
    if (text[text.length - 1] === '\n' && text.length === offset && offset >= lastBaseline.endCharacter) {
        newRange[0] = baselines.length + (offset - lastBaseline.endCharacter)
        newRange[1] = 0
        editor.setSelection({
            anchor: newRange,
            focus: newRange,
        })
        return;
    }
    if (idx === -1) {
        if (offset === baselines[baselines.length - 1].endCharacter) {
            newRange[0] = baselines.length - 1
            newRange[1] = offset - baselines[baselines.length - 1].firstCharacter
            editor.setSelection({
                anchor: newRange,
                focus: newRange,
            })
        }
    } else if (baselines[idx].width !== 0) {
        newRange[0] = idx
        newRange[1] = offset - baselines[idx].firstCharacter
        editor.setSelection({
            anchor: newRange,
            focus: newRange,
        })
    }
    editor.fixSelection()
}

export const wrapSelection = (editor: Editor, distance: 1 | -1) => {
    const baselines = editor.getBaselines()
    if (!editor.isCollapse() || !baselines?.length) return
    const select = editor.selection.anchor
    const newRange = [select[0] + distance, 0] as [number, number];
    if (distance === -1) {
        const curBaseline = baselines[newRange[0]]
        if (!curBaseline) newRange[1] = 0
        else newRange[1] = curBaseline.endCharacter - curBaseline.firstCharacter
    }
    editor.setSelection({
        anchor: newRange,
        focus: newRange,
    })

}