import { clearGetStyleCache, deepClone, EditorInterface, execEvent, mergeStyleOverride, StyleInterface } from "..";

export const reduceLetterSpacing: EditorInterface['reduceLetterSpacing'] = (editor) => {
    const { textData } = editor
    const characterStyleIDs = [...(textData?.characterStyleIDs ?? [])]
    const styleOverrideTable = deepClone(textData.styleOverrideTable)
    const offset = editor.getSelectCharacterOffset()
    if (!offset) return

    // 存在选区则清空临时样式
    clearGetStyleCache(editor);

    const addNum = editor.style.letterSpacing.units === 'PERCENT' ? -5 : -1
    const limit = editor.style.letterSpacing.value + addNum >= 0

    const sliceIds = characterStyleIDs?.slice(offset.anchor, offset.focus);
    const idSet = new Set(sliceIds);

    if (!idSet.size) {
        if (limit) {
            editor.setStyle({
                letterSpacing: {
                    value: editor.style.letterSpacing.value + addNum,
                    units: editor.style.letterSpacing.units
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

    const addletterSpacingRecord = (override: Record<string, any>, styleId: number, letterSpacing: StyleInterface['letterSpacing']) => {
        maxStyleID++
        newStyleOverrideTable.push({
            ...deepClone(override),
            styleID: maxStyleID,
            letterSpacing
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
            if (override?.letterSpacing !== undefined) {
                const addNum = override.letterSpacing.units === 'PERCENT' ? -5 : -1
                if (override.letterSpacing.value + addNum >= 0) {
                    const letterSpacing = { value: override.letterSpacing.value + addNum, units: override.letterSpacing.units } as StyleInterface['letterSpacing']
                    addletterSpacingRecord(override, override.styleID, letterSpacing)
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
                const letterSpacing = { value: editor.style.letterSpacing.value + addNum, units: editor.style.letterSpacing.units } as StyleInterface['letterSpacing']
                addletterSpacingRecord(override, override.styleID, letterSpacing)
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
        const letterSpacing = { value: editor.style.letterSpacing.value + addNum, units: editor.style.letterSpacing.units } as StyleInterface['letterSpacing']
        styleOverrideTable.push({
            styleID: maxStyleID,
            letterSpacing
        })
    }

    mergeStyleOverride(editor, characterStyleIDs, styleOverrideTable)
    execEvent(editor, 'setStyle')
}