import { EditorInterface, getLineFirstCharacterList } from "..";

export const arrowMove: EditorInterface['arrowMove'] = (editor, type, options = {}) => {
    const offset = editor.getSelectCharacterOffset();
    const baselines = editor.getBaselines()

    if (!offset || !baselines?.length) return

    if (options?.shift && options?.command) {
        if (type === 'left') {
            const selection = editor.getSelection();
            editor.setSelection({
                anchor: selection.anchor,
                anchorOffset: 0
            })
            return
        }
        if (type === 'right') {
            let { focus } = { ...editor.__selection }
            const baseline = baselines[focus]
            const offsetList = editor.getBaseLineCharacterOffset(focus)
            if (!offsetList) return;
            const x = offsetList[offsetList.length - 1] + baseline.position.x
            const y = baseline.lineY + 1;
            const oldSelection = editor.getSelection()
            editor.selectForXY(x, y)
            editor.setSelection({
                anchor: oldSelection.anchor,
                anchorOffset: oldSelection.anchorOffset
            })
            return
        }
        if (type === 'top') {
            let { anchor, anchorOffset } = editor.getSelection()
            let baseline = baselines[anchor]
            if (anchor !== 0 && anchorOffset === 0) {
                baseline = baselines[anchor - 1]
            }
            const lineList = getLineFirstCharacterList(editor)
            let idx = lineList.findIndex(item => item > baseline.firstCharacter) - 1;
            if (idx === -1) {
                idx = 0
            }
            if (idx < 0) {
                idx = lineList.length - 1
            }
            const character = lineList[idx]
            const baselineIdx = baselines.findIndex(item => item.firstCharacter <= character && item.endCharacter > character)
            if (baselineIdx > -1) {
                editor.setSelection({
                    anchor: baselineIdx,
                    anchorOffset: 0
                })
            }
            return
        }
        if (type === 'bottom') {
            let { focus, focusOffset } = editor.getSelection()
            let baseline = baselines[focus]
            if (focus !== baselines.length - 1 && focusOffset === baseline.endCharacter - baseline.firstCharacter - 1) {
                baseline = baselines[focus + 1]
            }
            const lineList = getLineFirstCharacterList(editor)
            let idx = lineList.findIndex(item => item > baseline.firstCharacter);
            let character = 0
            if (idx === -1) {
                character = baselines[baselines.length - 1].endCharacter - 1;
            } else {
                character = lineList[idx] - 1;
            }
            let baselineIdx = baselines.findIndex(item => item.firstCharacter <= character && item.endCharacter > character)
            if (baselineIdx > -1) {
                let offset = baselines[baselineIdx].endCharacter - baselines[baselineIdx].firstCharacter - 1
                if (baselineIdx === baselines.length - 1) {
                    offset = baselines[baselineIdx].endCharacter - baselines[baselineIdx].firstCharacter
                }
                editor.setSelection({
                    focus: baselineIdx,
                    focusOffset: offset,
                })
            }
            return
        }
    }

    if (options?.shift) {
        if (type === 'left') {
            let { focus, focusOffset } = { ...editor.__selection }
            focusOffset--;
            if (focusOffset === -1) {
                if (focus > 0) {
                    focus--;
                    focusOffset = baselines[focus].endCharacter - baselines[focus].firstCharacter - 1
                } else {
                    return;
                }
            }
            editor.setSelection({
                focus,
                focusOffset
            })
            return
        }
        if (type === 'right') {
            let { focus, focusOffset } = { ...editor.__selection }
            focusOffset++;
            const limitOffset = baselines[focus].endCharacter - baselines[focus].firstCharacter - 1
            if (focusOffset > limitOffset) {
                if (focus < baselines.length - 1) {
                    focus++;
                    focusOffset = 0
                } else {
                    focusOffset = baselines[focus].endCharacter - baselines[focus].firstCharacter
                }
            }
            editor.setSelection({
                focus,
                focusOffset
            })
            return
        }
        if (type === 'top') {
            let { focus, focusOffset } = { ...editor.__selection }
            const baseline = baselines[focus]
            if (!baseline) return;
            const y = baseline.lineY - 1;
            const offsetList = editor.getBaseLineCharacterOffset(focus)
            if (!offsetList) return;
            let x = offsetList[focusOffset] + baseline.position.x
            if (focus === 0) {
                x = 0
            }
            editor.selectForXY(x, y, { move: true })
            return;
        }
        if (type === 'bottom') {
            let { focus, focusOffset } = { ...editor.__selection }
            const baseline = baselines[focus]
            const y = baseline.lineY + baseline.lineHeight + 1;
            const offsetList = editor.getBaseLineCharacterOffset(focus)
            if (!offsetList) return;
            let x = offsetList[focusOffset] + baseline.position.x
            if (focus === baselines.length - 1) {
                x = offsetList[offsetList.length - 1]
            }
            editor.selectForXY(x, y, { move: true })
            return;
        }
    }
    if (options?.command) {
        if (type === 'left') {
            const selection = editor.getSelection();
            editor.setSelection({
                focus: selection.anchor,
                anchorOffset: 0,
                focusOffset: 0
            })
            return
        }
        if (type === 'right') {
            let { focus } = { ...editor.__selection }
            const baseline = baselines[focus]
            const offsetList = editor.getBaseLineCharacterOffset(focus)
            if (!offsetList) return;
            const x = offsetList[offsetList.length - 1] + baseline.position.x
            const y = baseline.lineY + 1;
            editor.selectForXY(x, y)
            return
        }
        if (type === 'top') {
            let { anchor } = { ...editor.__selection }
            const baseline = baselines[anchor]
            const lineList = getLineFirstCharacterList(editor)
            let idx = lineList.findIndex(item => item > baseline.firstCharacter) - 1;
            if (idx === -1) {
                idx = 0
            }
            if (idx < 0) {
                idx = lineList.length - 1
            }
            const character = lineList[idx]
            const baselineIdx = baselines.findIndex(item => item.firstCharacter <= character && item.endCharacter > character)
            if (baselineIdx > -1) {
                editor.setSelection({
                    focus: baselineIdx,
                    anchor: baselineIdx,
                    anchorOffset: 0,
                    focusOffset: 0
                })
            }
            return
        }
        if (type === 'bottom') {
            let { focus } = { ...editor.__selection }
            const baseline = baselines[focus]
            const lineList = getLineFirstCharacterList(editor)
            let idx = lineList.findIndex(item => item > baseline.firstCharacter);
            let character = 0
            if (idx === -1) {
                character = baselines[baselines.length - 1].endCharacter - 1;
            } else {
                character = lineList[idx] - 1;
            }
            let baselineIdx = baselines.findIndex(item => item.firstCharacter <= character && item.endCharacter > character)
            if (baselineIdx > -1) {
                let offset = baselines[baselineIdx].endCharacter - baselines[baselineIdx].firstCharacter - 1
                if (baselineIdx === baselines.length - 1) {
                    offset = baselines[baselineIdx].endCharacter - baselines[baselineIdx].firstCharacter
                }
                editor.setSelection({
                    focus: baselineIdx,
                    anchor: baselineIdx,
                    anchorOffset: offset,
                    focusOffset: offset
                })
            }
            return
        }
    }

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
        editor.selectForXY(x, y)
        return
    }
    if (type === 'bottom') {
        let baselineIdx = baselines.findIndex(item => item.firstCharacter <= offset.focus && item.endCharacter > offset.focus)
        baselineIdx = baselineIdx < 0 ? baselines.length - 1 : baselineIdx
        const baseline = baselines[baselineIdx]
        const y = baseline.lineY + baseline.lineHeight + 1;
        const offsetList = editor.getBaseLineCharacterOffset(baselineIdx)
        if (!offsetList) return;
        const x = offsetList[offset.anchor - baseline.firstCharacter] + baseline.position.x
        editor.selectForXY(x, y)
        return
    }
}