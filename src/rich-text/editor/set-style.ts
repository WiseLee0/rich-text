import { clearGetStyleCache, deepEqual, Editor, EditorInterface, execEvent, StyleInterface } from "..";

export const setStyle: EditorInterface['setStyle'] = (editor, styles) => {

    clearGetStyleCache(editor)  // 清除获取样式缓存

    if (styles.fontName) {
        styles.fontVariations = []
    }

    handleStyleOverride(editor, styles)

    editor.style = {
        ...editor.style,
        ...styles
    }

    execEvent(editor, 'setStyle')
}


/** 控制哪些属性允许局部更新样式 */
const getChangeStyles = (styles: Partial<StyleInterface>, isAllSelectModify: boolean) => {
    const changeStyles: Partial<StyleInterface> = {}
    if (styles['fontName']) {
        changeStyles['fontName'] = styles['fontName']
        changeStyles['fontVariations'] = styles['fontVariations'] ?? []
        if (!isAllSelectModify) delete styles['fontName']
        if (!isAllSelectModify) delete styles['fontVariations']
    }
    if (styles['fontSize']) {
        changeStyles['fontSize'] = styles['fontSize']
        if (!isAllSelectModify) delete styles['fontSize']
    }
    if (styles['textDecoration']) {
        changeStyles['textDecoration'] = styles['textDecoration']
        if (!isAllSelectModify) delete styles['textDecoration']
    }
    if (styles['hyperlink']) {
        changeStyles['hyperlink'] = styles['hyperlink']
        if (!isAllSelectModify) delete styles['hyperlink']
    }
    if (styles['fillPaints']) {
        changeStyles['fillPaints'] = styles['fillPaints']
        if (!isAllSelectModify) delete styles['fillPaints']
    }

    return changeStyles
}

/** 处理局部样式更新 */
const handleStyleOverride: EditorInterface['setStyle'] = (editor, styles) => {
    let characterOffset = editor.getSelectCharacterOffset()
    let anchor = characterOffset?.anchor ?? 0
    let focus = characterOffset?.focus ?? editor.textData.characters.length
    const { textData } = editor
    const { characterStyleIDs, styleOverrideTable } = textData
    const isAllSelectModify = anchor === 0 && focus === editor.textData.characters.length  // 全选修改

    // 全选修改，则先应用一次
    if (isAllSelectModify) {
        editor.style = {
            ...editor.style,
            ...styles
        }
    }

    const changeStyles = getChangeStyles(styles, isAllSelectModify)
    if (!Object.keys(changeStyles).length) return

    // 第一次局部修改
    if (!characterStyleIDs?.length || !styleOverrideTable?.length) {
        if (isAllSelectModify) return
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
    mergeStyleOverride(editor, newCharacterStyleIDs, newStyleOverrideTableMap)
}

export const mergeStyleOverride = (editor: Editor, characterStyleIDs: number[], styleOverrideTable: Record<string, any> | Map<number, Record<string, any>>) => {
    const { textData } = editor
    const newCharacterStyleIDs = [...characterStyleIDs]
    let newStyleOverrideTableMap: Map<number, Record<string, any>> = new Map()
    if (styleOverrideTable instanceof Map) {
        newStyleOverrideTableMap = styleOverrideTable
    } else {
        for (let i = 0; i < styleOverrideTable.length; i++) {
            const { styleID, ...rest } = styleOverrideTable[i];
            newStyleOverrideTableMap.set(styleID, rest)
        }
    }

    // 检查临近样式是否能合并 比如：[0,0,1,1,2,3,0,0,4,5]，检查[1,1,2,3]、[4,5]是否能合并ID
    const visitStyleIDSet = new Set<number>()
    const visitStyleIDMap = new Map<number, Set<number>>()
    for (let i = 0; i < newCharacterStyleIDs.length; i++) {
        const styleID = newCharacterStyleIDs[i];
        if (visitStyleIDSet.has(styleID) || styleID === 0) continue
        const curOverride = newStyleOverrideTableMap.get(styleID)
        if (!curOverride) {
            console.warn('mergeStyleOverride exception')
            continue
        }
        // 获取临近的样式ID
        const temp_set = new Set<number>()
        for (let j = i; j < newCharacterStyleIDs.length; j++) {
            const nextID = newCharacterStyleIDs[j]
            if (!nextID) break;
            if (nextID === styleID) continue
            const nextOverride = newStyleOverrideTableMap.get(nextID)
            if (!curOverride) {
                console.warn('mergeStyleOverride exception')
                continue
            }
            if (deepEqual(curOverride, nextOverride)) {
                visitStyleIDSet.add(nextID)
                temp_set.add(nextID)
            }
        }
        if (temp_set.size > 0) {
            visitStyleIDMap.set(styleID, temp_set)
        }
    }
    // 如果检查[1,1,2,3]、[4,5]结果能合并，则执行合并更新样式ID逻辑
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
    const resultStyleOverrideTableMap = new Map<number, any>()
    let resultCharacterStyleIDs = [...newCharacterStyleIDs]
    for (const [styleID, element] of newStyleOverrideTableMap) {
        const newElement: any = {}
        let needDelete = true
        for (const key in element) {
            if (!deepEqual(element[key], editor.style[key as keyof StyleInterface])) {
                newElement[key] = element[key]
                needDelete = false
            }
        }
        if (needDelete) {
            resultCharacterStyleIDs = resultCharacterStyleIDs.map(item => {
                if (item === styleID) return 0
                return item
            })
            continue
        }
        resultStyleOverrideTableMap.set(styleID, newElement)
    }
    if (!resultStyleOverrideTableMap.size) {
        delete textData.styleOverrideTable
        delete textData.characterStyleIDs
        return
    }
    while (resultCharacterStyleIDs[resultCharacterStyleIDs.length - 1] === 0) {
        resultCharacterStyleIDs.pop()
    }
    if (!resultCharacterStyleIDs.length) {
        delete textData.styleOverrideTable
        delete textData.characterStyleIDs
        return
    }

    textData.characterStyleIDs = resultCharacterStyleIDs
    const resultCharacterStyleIDSet = new Set(resultCharacterStyleIDs)
    const newStyleOverrideTable: Record<string, any>[] = []
    for (const [styleID, element] of resultStyleOverrideTableMap) {
        if (resultCharacterStyleIDSet.has(styleID)) {
            newStyleOverrideTable.push({
                styleID,
                ...element
            })
        }
    }
    textData.styleOverrideTable = newStyleOverrideTable
}