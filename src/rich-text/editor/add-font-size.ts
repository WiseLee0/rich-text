import { clearGetStyleCache, deepClone, EditorInterface, execEvent, mergeStyleOverride } from "..";

export const addFontSize: EditorInterface['addFontSize'] = (editor) => {
    const { textData } = editor
    const characterStyleIDs = [...(textData?.characterStyleIDs ?? [])]
    const styleOverrideTable = deepClone(textData.styleOverrideTable)
    const offset = editor.getSelectCharacterOffset()
    if (!offset) return

    // 存在选区则清空临时样式
    clearGetStyleCache(editor);

    const limit = editor.style.fontSize < 25600

    const sliceIds = characterStyleIDs?.slice(offset.anchor, offset.focus);
    const idSet = new Set(sliceIds);

    if (!idSet.size) {
        if (limit) {
            editor.setStyle({
                fontSize: editor.style.fontSize + 1
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

    const addFontSizeRecord = (override: Record<string, any>, styleId: number, fontSize: number) => {
        maxStyleID++
        newStyleOverrideTable.push({
            ...deepClone(override),
            styleID: maxStyleID,
            fontSize
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
            if (override?.fontSize !== undefined) {
                if (override.fontSize < 25600) {
                    addFontSizeRecord(override, override.styleID, override.fontSize + 1)
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
                addFontSizeRecord(override, override.styleID, editor.style.fontSize + 1)
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
        styleOverrideTable.push({
            styleID: maxStyleID,
            fontSize: editor.style.fontSize + 1
        })
    }

    mergeStyleOverride(editor, characterStyleIDs, styleOverrideTable)
    execEvent(editor, 'setStyle')
}