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
}