import { Editor } from ".."

export const setFontFeatures = (editor: Editor, offset: number) => {
    const feature: Record<string, boolean> = {
        // 在特定字符对之间调整字符间距，以确保视觉上的均衡和美观
        kern: true,
        // 标准连字，如 "fi"、"fl" 等，通常用于日常排版
        liga: true,
        // 上下文连字，根据特定的上下文条件出现的连字
        clig: true,
        // 必需连字，在特定语言或排版情况下必须使用的连字
        rlig: true,
        // 基本上下文替代，根据字符的上下文自动替换为更适合的字形
        calt: true,
        // 必需的上下文替代，在特定语言规则下必须进行的替换
        rclt: true,
        // 字形的合成和分解，用于处理复合字符或分解字符
        ccmp: true,
        // 与光标相关的特性，用于在编辑或显示文本时处理光标位置
        cursor: true,
        // 本地化表单，根据不同的语言或区域替换为适合特定语言的字形
        locl: true,
        // 标记定位，用于精确定位附加标记（如重音符号）的位置
        mark: true,
        // 标记到标记定位，用于定位一个标记相对于另一个标记的位置
        mkmk: true,
    }
    const styleID = editor.textData?.characterStyleIDs?.[offset]
    const overrideStyle = editor.textData?.styleOverrideTable?.find(item => item.styleID === styleID)
    const style = overrideStyle ?? editor.getStyle()
    if (style.fontLigatures === "DISABLE") feature.liga = false
    if (style.fontPosition === "SUPER") feature.sups = true
    if (style.fontPosition === "SUB") feature.subs = true
    if (style.fontNumericFraction === "ENABLE") {
        feature.frac = true
        feature.numr = true
    }
    return feature
}