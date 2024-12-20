export interface BaseLineInterface {
    position: {
        x: number,
        y: number
    },
    width: number,
    lineY: number,
    defaultLineHeight: number,      // 字体默认的行高
    lineHeight: number,             // 样式设置的行高
    lineAscent: number,
    firstCharacter: number,
    endCharacter: number,
    capHeight: number
}