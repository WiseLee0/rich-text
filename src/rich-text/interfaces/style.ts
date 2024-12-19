export interface StyleInterface {
    /** 字体大小 */
    fontSize: number,
    /** 布局方式 */
    textAutoResize: "NONE" | "HEIGHT" | "WIDTH_AND_HEIGHT"
    /** 水平对齐方式 */
    textAlignHorizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFIED',
    /** 水平垂直方式 */
    textAlignVertical: 'TOP' | 'MIDDLE' | 'BOTTOM',
    /** 大小写 */
    textCase: "NONE" | "LOWER" | "UPPER" | "TITLE",
    /** 文本修饰 */
    textDecoration: "STRIKETHROUGH" | "UNDERLINE" | "NONE",
    /** 段落缩进 */
    paragraphIndent: number,

    /** 文本省略 */
    textTruncation: SwitchType,
    /** 省略最大行数 */
    maxLines: number,
    /** 省略开始下标字符 */
    truncationStartIndex: number,
    /** 省略高度 */
    truncatedHeight: number,

    /** 垂直裁剪 */
    leadingTrim: "CAP_HEIGHT" | "NONE"
    /** 行高 */
    lineHeight: {
        value: number,
        units: "PERCENT" | "PIXELS" | "RAW"
    },
    hyperlink?: {
        url: string
    },
    /** 字体 */
    fontName: {
        family: string,
        style: string,
        postscript: string
    },
    /** 词间距 */
    letterSpacing: {
        value: number,
        units: "PERCENT" | "PIXELS"
    },
    /** 可变字体 */
    fontVariations: Record<string, number>,
    /** 填充样式 */
    fillPaints: FillPaintType[],
    /** 字体常见连字 */
    fontLigatures: SwitchType
    /** 数字位置 上标&下标 */
    fontPosition: "NONE" | "SUPER" | "SUB"
    /** 数字分数 */
    fontNumericFraction: SwitchType
}

export type FillPaintType = {
    type: "SOLID",
    color: {
        r: number,
        g: number,
        b: number,
        a: number
    },
    opacity: number,
    visible: boolean,
    blendMode: BlendModeType
}

export type BlendModeType = "NORMAL" | "DARKEN"

type SwitchType = "DISABLE" | "ENABLE"