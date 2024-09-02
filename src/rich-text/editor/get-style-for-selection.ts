import { deepClone, deepEqual, EditorInterface, getTextArr } from "..";

export const getStyleForSelection: EditorInterface['getStyleForSelection'] = (editor) => {
    if (!editor.textData.characterStyleIDs?.length || !editor.textData.styleOverrideTable?.length) return deepClone(editor.style)
    let characterOffset = editor.getSelectCharacterOffset()
    let anchor = characterOffset?.anchor ?? 0
    let focus = characterOffset?.focus ?? getTextArr(editor).length;
    const { __select_styles } = editor
    if (__select_styles?.focus === focus && __select_styles?.anchor === anchor) return deepClone(__select_styles.styles!)
    __select_styles.focus = focus
    __select_styles.anchor = anchor
    const { characterStyleIDs, styleOverrideTable } = editor.textData
    if (anchor === focus && anchor === 0) {
        __select_styles.styles = editor.style
        return deepClone(__select_styles.styles)
    }
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
        const overrideStyles: any = { ...editor.style, ...styleOverrideTableMap.get(styleID) }
        if (!overrideStyles) continue;
        for (const key in overrideStyles) {
            const overrideStyle = overrideStyles[key]
            const style = styles[key]
            // 应用覆盖样式表
            if (!style) {
                styles[key] = deepClone(overrideStyle)
                continue
            }
            if (style === 'mix') continue
            if (key === 'fontName') {
                if (style['family'] !== overrideStyle['family']) {
                    styles[key]['family'] = 'mix'
                }
                if (style['style'] !== overrideStyle['style']) {
                    styles[key]['style'] = 'mix'
                }
                continue;
            }
            if (!deepEqual(style, overrideStyle)) {
                styles[key] = 'mix'
            }
        }

    }
    __select_styles.styles = {
        ...editor.style,
        ...styles,
    }
    return deepClone(__select_styles.styles)
}