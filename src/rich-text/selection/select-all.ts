import { SelectionInterface } from "..";

export const selectAll: SelectionInterface['selectAll'] = (editor) => {
    const baselines = editor.getBaselines();
    if (editor.textData.characters.length && baselines?.length) {
        const idx = baselines.length - 1
        const baseline = baselines[idx]
        editor.setSelection({
            anchor: 0,
            focus: idx,
            anchorOffset: 0,
            focusOffset: baseline?.endCharacter - baseline.firstCharacter
        })
    }
}