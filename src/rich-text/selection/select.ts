import { findClosestIndex, SelectionInterface } from '..'

export const setSelection: SelectionInterface['setSelection'] = (editor, range) => {
    editor.selection = range
}

export const selectForXY: SelectionInterface['selectForXY'] = (editor, x, y) => {
    const baselines = editor.getBaselines()
    if (!baselines) {
        editor.selection = {
            anchor: [0, 0],
            focus: [0, 0],
        }
        return
    };

    // 找到最近的Y
    let yIdx = baselines.findIndex(item => item.lineY > y)
    if (yIdx === -1) yIdx = baselines.length - 1
    else if (yIdx === 0) yIdx = 0
    else yIdx -= 1

    // 获取最近Y的行
    const xArr = editor.getLineWidths(yIdx)
    if (!xArr) {
        console.warn('计算异常')
        return
    };

    // 找到最近的X
    const xIdx = findClosestIndex(xArr, x)

    const rangeOffset = [yIdx, xIdx] as [number, number]
    const range = {
        anchor: rangeOffset,
        focus: rangeOffset,
    }
    editor.selection = range
}

export const selectForOffset: SelectionInterface['selectForOffset'] = (editor, offset) => {
    const baselines = editor.getBaselines()
    if (!baselines) return;
    if (offset > baselines[baselines.length - 1].endCharacter) {
        const yIdx = baselines.length - 1
        const offsetRange = [yIdx, offset - baselines[baselines.length - 1].firstCharacter] as [number, number]
        const range = {
            anchor: offsetRange,
            focus: offsetRange,
        }
        editor.selection = range
        return;
    }
    const yIdx = baselines.findIndex(item => item.firstCharacter <= offset && item.endCharacter > offset)
    const offsetRange = [yIdx, offset - baselines[yIdx].firstCharacter] as [number, number]
    const range = {
        anchor: offsetRange,
        focus: offsetRange,
    }
    editor.selection = range
}

export const hasSelection: SelectionInterface['hasSelection'] = (editor) => {
    const { anchor, focus } = editor.selection
    return anchor[0] >= 0 && anchor[1] >= 0 && focus[0] >= 0 && focus[1] >= 0
}

export const deselect: SelectionInterface['deselect'] = (editor) => {
    editor.selection = {
        anchor: [-1, -1],
        focus: [-1, -1],
    }
}
