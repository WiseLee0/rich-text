import { SelectionInterface } from ".."

export const fixSelection: SelectionInterface['fixSelection'] = (editor) => {
    const baselines = editor.getBaselines()
    const metrices = editor.getMetrices()
    // 小于最小行
    if (!baselines?.length || !metrices?.length) {
        editor.setSelection({ anchor: [0, 0], focus: [0, 0] });
        return
    }
    if (editor.isCollapse()) {
        const checkRangeCase = () => {
            let [yIdx, xIdx] = editor.selection.focus
            // 小于最小行
            if (yIdx <= 0 && xIdx <= 0) {
                editor.setSelection({ anchor: [0, 0], focus: [0, 0] });
                return
            }
            // 超出最大行
            if (yIdx >= baselines.length || (xIdx >= (baselines[yIdx].endCharacter - baselines[yIdx].firstCharacter) && yIdx === baselines.length - 1)) {
                yIdx = baselines.length - 1
                xIdx = baselines[yIdx].endCharacter - baselines[yIdx].firstCharacter
                editor.setSelection({ anchor: [yIdx, xIdx], focus: [yIdx, xIdx] });
                return
            }
            const { firstCharacter, endCharacter } = baselines[yIdx]
            const offset = firstCharacter + xIdx
            // 不在当前行
            if (offset >= endCharacter || offset < firstCharacter) {
                yIdx = baselines.findIndex(item => item.firstCharacter <= offset && item.endCharacter > offset)
                if (yIdx === -1) {
                    // 再次搜索endCharacter
                    yIdx = baselines.findIndex(item => item.firstCharacter < offset && item.endCharacter >= offset)
                    if (yIdx === -1) {
                        console.warn('fixSelection unknown error')
                        return
                    }
                }
                xIdx = offset - baselines[yIdx].firstCharacter
                editor.setSelection({ anchor: [yIdx, xIdx], focus: [yIdx, xIdx] });
            }
        }

        const checkWrapCase = () => {
            let [yIdx, xIdx] = editor.selection.focus
            if (xIdx === 0) return;
            const offset = baselines[yIdx].firstCharacter + xIdx
            const metrice = metrices.find(item => item.firstCharacter === offset - 1)
            if (metrice?.name === '\n') {
                editor.setSelection({ anchor: [yIdx, xIdx - 1], focus: [yIdx, xIdx - 1] });
            }
        }

        checkRangeCase()
        checkWrapCase()
    }
}