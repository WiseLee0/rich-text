import { getTextArr, SelectionInterface } from ".."

export const selectForCharacterOffset: SelectionInterface['selectForCharacterOffset'] = (editor, characterOffset) => {
    editor.isEditor = true
    const baselines = editor.getBaselines()
    const textArr = getTextArr(editor)
    if (!baselines?.length) {
        return
    };

    const baselineIdx = baselines.findIndex(item => item.firstCharacter <= characterOffset && item.endCharacter > characterOffset)

    if (baselineIdx > -1) {
        const baseline = baselines[baselineIdx];
        editor.setSelection({
            anchor: baselineIdx,
            focus: baselineIdx,
            anchorOffset: characterOffset - baseline.firstCharacter,
            focusOffset: characterOffset - baseline.firstCharacter,
        })
        return;
    }

    if (characterOffset === textArr.length) {
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

    console.warn("selectForCharacterOffset expection");

    editor.deselection()
}