import { clearGetStyleCache, deepClone, EditorInterface, execEvent, mergeStyleOverride, StyleInterface } from "..";

export const reduceLineHeight: EditorInterface['reduceLineHeight'] = (editor) => {
    const { textData } = editor
    const characterStyleIDs = [...(textData?.characterStyleIDs ?? [])]
    const styleOverrideTable = deepClone(textData.styleOverrideTable)
    const offset = editor.getSelectCharacterOffset()
    if (!offset) return

    // 存在选区则清空临时样式
    clearGetStyleCache(editor);

    const addNum = editor.style.lineHeight.units === 'PERCENT' ? -5 : -1
    const limit = editor.style.lineHeight.value + addNum >= 0

    const sliceIds = characterStyleIDs?.slice(offset.anchor, offset.focus);
    const idSet = new Set(sliceIds);

    if (!idSet.size) {
        if (limit) {
            editor.setStyle({
                lineHeight: {
                    value: editor.style.lineHeight.value + addNum,
                    units: editor.style.lineHeight.units
                }
            })
        }
        return;
    }
    if (!characterStyleIDs?.length || !styleOverrideTable?.length) {
        return;
    }

    const visitIdSet = new Set<number>()
    let maxStyleID = Math.max(...characterStyleIDs)
    const newStyleOverrideTable: any[] = []

    const addLineHeightRecord = (override: Record<string, any>, styleId: number, lineHeight: StyleInterface['lineHeight']) => {
        maxStyleID++
        newStyleOverrideTable.push({
            ...deepClone(override),
            styleID: maxStyleID,
            lineHeight
        })
        for (let j = offset.anchor; j < offset.focus; j++) {
            const id = characterStyleIDs[j]
            if (styleId === id) {
                characterStyleIDs[j] = maxStyleID
            }
        }
    }

    if (styleOverrideTable?.length) {
        for (let i = 0; i < styleOverrideTable.length; i++) {
            const override = styleOverrideTable[i];
            if (!idSet.has(override.styleID)) continue;
            if (override?.lineHeight !== undefined) {
                const addNum = override.lineHeight.units === 'PERCENT' ? -5 : -1
                if (override.lineHeight.value + addNum >= 0) {
                    const lineHeight = { value: override.lineHeight.value + addNum, units: override.lineHeight.units } as StyleInterface['lineHeight']
                    addLineHeightRecord(override, override.styleID, lineHeight)
                }
                visitIdSet.add(override.styleID)
            }
        }
        for (const id of visitIdSet) {
            idSet.delete(id)
        }
        for (let i = 0; i < styleOverrideTable.length; i++) {
            const override = styleOverrideTable[i];
            if (!idSet.has(override.styleID)) continue;
            if (limit) {
                const lineHeight = { value: editor.style.lineHeight.value + addNum, units: editor.style.lineHeight.units } as StyleInterface['lineHeight']
                addLineHeightRecord(override, override.styleID, lineHeight)
            }
        }
        for (const item of newStyleOverrideTable) {
            styleOverrideTable.push(item)
        }
    }

    let hasModify = false
    maxStyleID++
    for (let j = offset.anchor; j < offset.focus; j++) {
        const id = characterStyleIDs[j]
        if (!id) {
            characterStyleIDs[j] = maxStyleID
            hasModify = true
        }
    }

    if (hasModify && limit) {
        const lineHeight = { value: editor.style.lineHeight.value + addNum, units: editor.style.lineHeight.units } as StyleInterface['lineHeight']
        styleOverrideTable.push({
            styleID: maxStyleID,
            lineHeight
        })
    }

    mergeStyleOverride(editor, characterStyleIDs, styleOverrideTable)
    execEvent(editor, 'setStyle')
}