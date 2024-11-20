import { getTextArr, SelectionInterface } from ".."

export const selectForCharacterOffset: SelectionInterface['selectForCharacterOffset'] = (editor, startOffset, endOffset) => {
    editor.isEditor = true
    const baselines = editor.getBaselines()
    const textArr = getTextArr(editor)
    if (!baselines?.length) {
        return
    };
    startOffset = Math.min(Math.max(0, startOffset), textArr.length);
    endOffset = endOffset ? Math.min(endOffset, textArr.length) : endOffset;

    if (endOffset === undefined || endOffset <= startOffset) {
        const baselineIdx = baselines.findIndex(item => item.firstCharacter <= startOffset && item.endCharacter > startOffset)

        if (baselineIdx > -1) {
            const baseline = baselines[baselineIdx];
            editor.setSelection({
                anchor: baselineIdx,
                focus: baselineIdx,
                anchorOffset: startOffset - baseline.firstCharacter,
                focusOffset: startOffset - baseline.firstCharacter,
            })
            return;
        }

        if (startOffset === textArr.length) {
            if (textArr[textArr.length - 1] === '\n') {
                editor.setSelection({
                    anchor: baselines.length,
                    focus: baselines.length,
                    anchorOffset: 0,
                    focusOffset: 0,
                })
                return
            }
            const baseline = baselines[baselines.length - 1];
            editor.setSelection({
                anchor: baselines.length - 1,
                focus: baselines.length - 1,
                anchorOffset: baseline.endCharacter - baseline.firstCharacter,
                focusOffset: baseline.endCharacter - baseline.firstCharacter,
            })
            return;
        }
    } else {
        let startBaselineIdx = baselines.findIndex(item => item.firstCharacter <= startOffset && item.endCharacter > startOffset)
        const endBaselineIdx = baselines.findIndex(item => item.firstCharacter <= endOffset && item.endCharacter > endOffset)
        if (startBaselineIdx > -1 && endBaselineIdx > -1) {
            editor.setSelection({
                anchor: startBaselineIdx,
                focus: endBaselineIdx,
                anchorOffset: startOffset - baselines[startBaselineIdx].firstCharacter,
                focusOffset: endOffset - baselines[endBaselineIdx].firstCharacter,
            })
            return;
        }
        if (startBaselineIdx === -1) {
            startBaselineIdx = baselines.length - 1
        }
        if (endOffset === textArr.length) {
            if (textArr[textArr.length - 1] === '\n') {
                editor.setSelection({
                    anchor: startBaselineIdx,
                    focus: baselines.length,
                    anchorOffset: startOffset - baselines[startBaselineIdx].firstCharacter,
                    focusOffset: 0,
                })
                return;
            }
            const baseline = baselines[baselines.length - 1];
            editor.setSelection({
                anchor: startBaselineIdx,
                focus: baselines.length - 1,
                anchorOffset: startOffset - baselines[startBaselineIdx].firstCharacter,
                focusOffset: endOffset - baseline.firstCharacter,
            })
            return;
        }
    }


    console.warn("selectForCharacterOffset expection");

    editor.deselection()
}