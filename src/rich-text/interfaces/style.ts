export interface StyleInterface {
    fontSize: number,
    textAlignHorizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFIED',
    textAlignVertical: 'TOP' | 'MIDDLE' | 'BOTTOM',
    textCase?: "NONE" | "LOWER" | "UPPER" | "TITLE",
    textDecoration?: "STRIKETHROUGH" | "UNDERLINE" | "NONE",
    maxLines?: number,
    textTruncation?: "DISABLED" | "ENDING",
    lineHeight?: {
        value: number,
        units: "PERCENT" | "PIXELS"
    },
    hyperlink?: {
        url: string
    },
    fontName?: {
        family: string,
        style: string,
        postscript: string
    },
    letterSpacing?: {
        value: number,
        units: "PERCENT" | "PIXELS"
    },
    textAutoResize: "NONE" | "HEIGHT" | "WIDTH_AND_HEIGHT"
    fontVariations: {
        axisName: string,
        value: number
    }[]
    fillPaints: FillPaintType[]
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