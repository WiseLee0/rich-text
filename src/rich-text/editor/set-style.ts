import { deepEqual, EditorInterface, StyleInterface } from "..";

export const setStyle: EditorInterface['setStyle'] = (editor, styles) => {
    if (styles.fontName) {
        styles.fontVariations = []
    }

    handleStyleOverride(editor, styles)

    editor.style = {
        ...editor.style,
        ...styles
    }
}


/** 控制哪些属性允许局部更新样式 */
const getChangeStyles = (styles: Partial<StyleInterface>) => {
    const changeStyles: Partial<StyleInterface> = {}
    if (styles['fontName']) {
        changeStyles['fontName'] = styles['fontName']
        changeStyles['fontVariations'] = styles['fontVariations'] ?? []
        delete styles['fontName']
        delete styles['fontVariations']
    }
    if (styles['fontSize']) {
        changeStyles['fontSize'] = styles['fontSize']
        delete styles['fontSize']
    }
    if (styles['textDecoration']) {
        changeStyles['textDecoration'] = styles['textDecoration']
        delete styles['textDecoration']
    }
    if (styles['hyperlink']) {
        changeStyles['hyperlink'] = styles['hyperlink']
        delete styles['hyperlink']
    }

    return changeStyles
}

/** 处理局部样式更新 */
const handleStyleOverride: EditorInterface['setStyle'] = (editor, styles) => {
    let characterOffset = editor.getSelectCharacterOffset()
    let anchor = characterOffset?.anchor ?? 0
    let focus = characterOffset?.focus ?? editor.textData.characters.length

    const changeStyles = getChangeStyles(styles)
    if (!Object.keys(changeStyles).length) return

    const { textData } = editor
    const { characterStyleIDs, styleOverrideTable } = textData

    // 第一次局部修改
    if (!characterStyleIDs?.length || !styleOverrideTable?.length) {
        textData.characterStyleIDs = new Array(focus).fill(0, 0, anchor).fill(1, anchor, focus)
        textData.styleOverrideTable = [{
            styleID: 1,
            ...changeStyles
        }]
        return
    }

    let maxStyleID = Math.max(...characterStyleIDs) // 维护一个最大的样式ID作为新样式的增长ID
    const selectStyleIDSet = new Set(characterStyleIDs.slice(anchor, focus)) // 获取选区范围内的样式ID
    // 获取样式覆盖表，使用Map类型方便后续查询
    const styleOverrideTableMap = new Map<number, Record<string, any>>()
    for (let i = 0; i < styleOverrideTable.length; i++) {
        const { styleID, ...rest } = styleOverrideTable[i];
        styleOverrideTableMap.set(styleID, rest)
    }


    // 重新计算样式覆盖表
    const newCharacterStyleIDs: number[] = []
    const newStyleOverrideTableMap = new Map<number, Record<string, any>>()
    const maxLen = Math.max(characterStyleIDs.length, focus)
    for (let i = 0; i < maxLen; i++) {
        const styleID = characterStyleIDs[i];
        if (!styleID && i < anchor) {
            newCharacterStyleIDs.push(0)
            continue
        }
        if ((selectStyleIDSet.has(styleID) || !styleID) && i >= anchor && i < focus) {
            maxStyleID++
            newCharacterStyleIDs.push(maxStyleID)
            newStyleOverrideTableMap.set(maxStyleID, {
                ...styleOverrideTableMap.get(styleID),
                ...changeStyles,
            })
            continue
        }

        newCharacterStyleIDs.push(styleID)
        if (styleOverrideTableMap.has(styleID)) {
            newStyleOverrideTableMap.set(styleID, styleOverrideTableMap.get(styleID)!)
        }
    }

    // 合并样式覆盖表，找到相同的样式进行分组
    const visitStyleIDSet = new Set<number>()
    const visitStyleIDMap = new Map<number, Set<number>>()
    for (let i = 0; i < newCharacterStyleIDs.length; i++) {
        const styleID = newCharacterStyleIDs[i];
        if (visitStyleIDSet.has(styleID)) continue
        const override = newStyleOverrideTableMap.get(styleID)
        if (!override) continue
        const temp_set = new Set<number>()
        for (const [key, value] of newStyleOverrideTableMap) {
            if (key !== styleID && deepEqual(override, value)) {
                visitStyleIDSet.add(key)
                visitStyleIDSet.add(styleID)
                temp_set.add(key)
                temp_set.add(styleID)
            }
        }
        if (temp_set.size > 0) {
            maxStyleID++
            visitStyleIDMap.set(maxStyleID, temp_set)
        }
    }
    // 合并样式覆盖表，更新之前样式
    for (const [changeStyleID, replaceStyleIDSet] of visitStyleIDMap) {
        for (let i = 0; i < newCharacterStyleIDs.length; i++) {
            const styleID = newCharacterStyleIDs[i];
            if (replaceStyleIDSet.has(styleID)) {
                newCharacterStyleIDs[i] = changeStyleID
            }
        }
        for (const styleID of replaceStyleIDSet) {
            if (!newStyleOverrideTableMap.has(changeStyleID)) {
                const element = newStyleOverrideTableMap.get(styleID)
                element && newStyleOverrideTableMap.set(changeStyleID, element)
            }
            newStyleOverrideTableMap.delete(styleID)
        }
    }

    // 判断是否和主样式一致，一致则删除局部样式表
    if (newStyleOverrideTableMap.size === 1) {
        let isEqual = true
        for (const [_styleID, element] of newStyleOverrideTableMap) {
            for (const key in element) {
                if (!deepEqual(element[key], editor.style[key as keyof StyleInterface])) {
                    isEqual = false
                    break
                }
            }
            if (!isEqual) break
        }
        if (isEqual) {
            delete textData.styleOverrideTable
            delete textData.characterStyleIDs
            return;
        }
    }

    textData.characterStyleIDs = newCharacterStyleIDs
    const newStyleOverrideTable: Record<string, any>[] = []
    for (const [styleID, element] of newStyleOverrideTableMap) {
        newStyleOverrideTable.push({
            styleID,
            ...element
        })
    }
    textData.styleOverrideTable = newStyleOverrideTable
}

