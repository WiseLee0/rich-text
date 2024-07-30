import { deepClone, deepEqual, EditorInterface, StyleInterface } from "..";

export const getStyle: EditorInterface['getStyle'] = (editor, ignoreSelection) => {
    if (ignoreSelection) {
        return deepClone(editor.style)
    }
    if (!editor.textData.characterStyleIDs?.length || !editor.textData.styleOverrideTable?.length) return deepClone(editor.style)
    let characterOffset = editor.getSelectCharacterOffset()
    let anchor = characterOffset?.anchor ?? 0
    let focus = characterOffset?.focus ?? editor.textData.characters.length
    const { characterStyleIDs, styleOverrideTable } = editor.textData
    if (anchor === focus && anchor === 0) return deepClone(editor.style)
    if (anchor === focus && anchor !== 0) anchor -= 1
    const styleIDs = characterStyleIDs.slice(anchor, focus)
    if (focus > characterStyleIDs.length) styleIDs.push(0)
    // 获取样式覆盖表，使用Map类型方便后续查询
    const styleOverrideTableMap = new Map<number, Record<string, any>>()
    for (let i = 0; i < styleOverrideTable.length; i++) {
        const { styleID, ...rest } = styleOverrideTable[i];
        styleOverrideTableMap.set(styleID, rest)
    }

    // 标注混合样式
    const styles: Record<string, any> = {}
    for (let i = 0; i < styleIDs.length; i++) {
        const styleID = styleIDs[i];
        const override: any = { ...editor.style, ...styleOverrideTableMap.get(styleID) }
        if (override) {
            for (const key in override) {
                const style = styles[key]
                if (!style) {
                    styles[key] = deepClone(override[key as keyof StyleInterface])
                    continue
                }
                if (style === 'mix') continue
                if (key === 'fontName') {
                    if (style['family'] !== override[key]['family']) {
                        styles[key]['family'] = 'mix'
                    }
                    if (style['style'] !== override[key]['style']) {
                        styles[key]['style'] = 'mix'
                    }
                    continue;
                }
                if (!deepEqual(style, override[key as keyof StyleInterface])) {
                    styles[key] = 'mix'
                }
            }
        }
    }
    return deepClone({
        ...editor.style,
        ...styles,
    })
}