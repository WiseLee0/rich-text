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
    maxLines?: number,
    textTruncation?: "DISABLED" | "ENDING",
    lineHeight?: {
        value: number,
        units: "PERCENT" | "PIXELS"
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
    letterSpacing?: {
        value: number,
        units: "PERCENT" | "PIXELS"
    },
    /** 可变字体 */
    fontVariations: {
        axisName: string,
        value: number
    }[]
    /** 填充样式 */
    fillPaints: FillPaintType[],
    /** 字体常见连字 */
    fontLigatures: "ENABLE" | "DISABLE"
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