export interface StyleInterface {
    fontSize: number,
    textAlignHorizontal: 'left' | 'right' | 'center' | 'justify',
    textAlignVertical: 'top' | 'middle' | 'bottom',
    textCase?: "ORIGINAL" | "LOWER" | "UPPER" | "TITLE",
    textDecoration?: "STRIKETHROUGH" | "UNDERLINE",
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