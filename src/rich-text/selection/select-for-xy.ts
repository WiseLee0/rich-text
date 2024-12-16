import { findClosestIndex, getLineFirstCharacterList, getLineIndexForCharacterOffset, getTextArr, SelectionInterface, wordTokenize } from ".."

export const selectForXY: SelectionInterface['selectForXY'] = (editor, x, y, { move, shift, clickCount } = {}) => {
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

    // 双击选区
    if (clickCount === 2 && baselines[yIdx]) {
        const text = getTextArr(editor);
        const lineList = getLineFirstCharacterList(editor)
        const lineIdx = getLineIndexForCharacterOffset(editor, baselines[yIdx].firstCharacter + xIdx)
        const offset = baselines[yIdx].firstCharacter + xIdx - lineList[lineIdx]
        const lineText = text.slice(lineList[lineIdx], lineList[lineIdx + 1]).join('')
        const wordArr = wordTokenize(lineText)
        let len = 0
        for (let i = 0; i < wordArr.length; i++) {
            const wordLen = Array.from(wordArr[i]).length
            len += wordLen;
            if (offset <= len) {
                const startIdx = lineList[lineIdx] + len - wordLen
                const endIdx = lineList[lineIdx] + len

                let startBaselineIdx = baselines.findIndex(item => item.firstCharacter <= startIdx && item.endCharacter > startIdx)
                let endBaselineIdx = baselines.findIndex(item => item.firstCharacter <= endIdx && item.endCharacter >= endIdx)

                editor.setSelection({
                    anchor: startBaselineIdx,
                    focus: endBaselineIdx,
                    anchorOffset: startIdx - baselines[startBaselineIdx].firstCharacter,
                    focusOffset: endIdx - baselines[endBaselineIdx].firstCharacter
                })
                return
            }
        }

        return;
    }

    // 三击选区
    if (clickCount === 3 && baselines[yIdx]) {
        const lineList = getLineFirstCharacterList(editor)
        const lineIdx = getLineIndexForCharacterOffset(editor, baselines[yIdx].firstCharacter + xIdx)
        const startIdx = lineList[lineIdx]
        const endIdx = lineList[lineIdx + 1] ?? baselines[baselines.length - 1].endCharacter
        let startBaselineIdx = baselines.findIndex(item => item.firstCharacter <= startIdx && item.endCharacter > startIdx)
        let endBaselineIdx = baselines.findIndex(item => item.firstCharacter <= endIdx && item.endCharacter >= endIdx)

        editor.setSelection({
            anchor: startBaselineIdx,
            focus: endBaselineIdx,
            anchorOffset: startIdx - baselines[startBaselineIdx].firstCharacter,
            focusOffset: endIdx - baselines[endBaselineIdx].firstCharacter
        })
        return;
    }

    // 四击选区
    if (clickCount === 4 && baselines[yIdx]) {
        editor.selectAll()
        return;
    }

    // 单击选区

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
    if (move) {
        editor.setSelection({
            focus: yIdx,
            focusOffset: xIdx,
        })
        return
    }

    editor.setSelection({
        anchor: yIdx,
        focus: yIdx,
        anchorOffset: xIdx,
        focusOffset: xIdx
    })
    return
}
