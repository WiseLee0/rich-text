import { findClosestIndex, SelectionInterface } from ".."

export const selectForXY: SelectionInterface['selectForXY'] = (editor, x, y, isAnchor) => {
    const baselines = editor.getBaselines()
    if (!baselines?.length) {
        editor.deselection()
        return
    };

    // 找到最近的Y
    let yIdx = baselines.findIndex(item => item.lineY > y)
    if (yIdx === -1) yIdx = baselines.length - 1
    else if (yIdx === 0) yIdx = 0
    else yIdx -= 1

    // 获取最近Y的行
    const baseline = baselines[yIdx]
    const xArr = editor.getBaseLineCharacterOffset(yIdx)?.map(item => item + baseline.position.x)
    if (!xArr) {
        console.warn('计算异常')
        return
    };

    // 找到最近的X
    let xIdx = findClosestIndex(xArr, x)

    // 判断最后一个字符是不是换行
    if (yIdx === baselines.length - 1) {
        const text = editor.getText()
        const lastBaseLine = baselines[baselines.length - 1]
        if (text[text.length - 1] === '\n' && y > lastBaseLine.lineY + lastBaseLine.lineHeight) {
            yIdx += 1
            xIdx = 0
        }
    }

    if (isAnchor === undefined) {
        editor.setSelection({
            anchor: yIdx,
            focus: yIdx,
            anchorOffset: xIdx,
            focusOffset: xIdx
        })
        return
    }

    if (isAnchor) {
        editor.setSelection({
            anchor: yIdx,
            anchorOffset: xIdx,
        })
    } else {
        editor.setSelection({
            focus: yIdx,
            focusOffset: xIdx,
        })
    }
}
