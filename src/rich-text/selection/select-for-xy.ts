import { findClosestIndex, SelectionInterface } from ".."

export const selectForXY: SelectionInterface['selectForXY'] = (editor, x, y, { move, shift, click }) => {
    editor.isEditor = true
    const baselines = editor.getBaselines()
    if (!baselines?.length) {
        return
    };

    // 找到最近的Y, 优先找元素行高范围内的
    let yIdx = baselines.findIndex(item => item.lineY < y && y < item.lineY + Math.max(item.lineHeight, item.defaultLineHeight))

    if (yIdx === -1) {
        // 找不到，再去根据y值找最近的
        yIdx = baselines.findIndex(item => item.lineY > y)
        if (yIdx === -1) yIdx = baselines.length - 1
        else if (yIdx === 0) yIdx = 0
        else yIdx -= 1
    }


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
        if (text.length > 1 && text[text.length - 1] === '\n' && y > lastBaseLine.lineY + lastBaseLine.lineHeight) {
            yIdx += 1
            xIdx = 0
        }
        if (text === '\n') {
            yIdx = 0
            xIdx = 0
        }
    }

    if (shift) {
        if (!editor.hasSelection()) {
            editor.setSelection({
                anchor: yIdx,
                focus: yIdx,
                anchorOffset: xIdx,
                focusOffset: xIdx
            })
            return
        }
        const { anchor, anchorOffset, focus, focusOffset } = editor.getSelection()
        if (yIdx < anchor || (yIdx === anchor && xIdx < anchorOffset)) {
            editor.setSelection({
                anchor: yIdx,
                anchorOffset: xIdx,
            })
            return;
        } else if (yIdx > focus || (yIdx === focus && xIdx > focusOffset)) {
            editor.setSelection({
                focus: yIdx,
                focusOffset: xIdx,
            })
            return;
        }
        return;
    }
    if (click) {
        editor.setSelection({
            anchor: yIdx,
            focus: yIdx,
            anchorOffset: xIdx,
            focusOffset: xIdx
        })
        return
    }
    if (move) {
        editor.setSelection({
            focus: yIdx,
            focusOffset: xIdx,
        })
        return
    }
}
