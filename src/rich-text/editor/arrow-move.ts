import { EditorInterface } from "..";

export const arrowMove: EditorInterface['arrowMove'] = (editor, type) => {
    const offset = editor.getSelectCharacterOffset();
    const baselines = editor.getBaselines()

    if (!offset || !baselines?.length) return
    if (type === 'left') {
        editor.selectForCharacterOffset(offset.anchor - 1);
        return
    }
    if (type === 'right') {
        editor.selectForCharacterOffset(offset.focus + 1);
        return
    }
    if (type === 'top') {
        let baselineIdx = baselines.findIndex(item => item.firstCharacter <= offset.anchor && item.endCharacter > offset.anchor)
        baselineIdx = baselineIdx < 0 ? baselines.length - 1 : baselineIdx
        const baseline = baselines[baselineIdx]
        const y = baseline.lineY - 1;
        const offsetList = editor.getBaseLineCharacterOffset(baselineIdx)
        if (!offsetList) return;
        const x = offsetList[offset.anchor - baseline.firstCharacter] + baseline.position.x
        editor.selectForXY(x, y, { click: true })
        return
    }
    if (type === 'bottom') {
        let baselineIdx = baselines.findIndex(item => item.firstCharacter <= offset.anchor && item.endCharacter > offset.anchor)
        baselineIdx = baselineIdx < 0 ? baselines.length - 1 : baselineIdx
        const baseline = baselines[baselineIdx]
        const y = baseline.lineY + baseline.lineHeight + 1;
        const offsetList = editor.getBaseLineCharacterOffset(baselineIdx)
        if (!offsetList) return;
        const x = offsetList[offset.anchor - baseline.firstCharacter] + baseline.position.x
        editor.selectForXY(x, y, { click: true })
        return
    }
}