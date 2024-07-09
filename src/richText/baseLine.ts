import { splitLines } from "./helper"
import type { MetricesInfo, BaseLineInfo } from './type'

type BaseLineProps = {
    w: number
    data: Record<string, any>
}
export const getBaseLine = (props: BaseLineProps & MetricesInfo) => {
    const { w, xAdvances, advanceHeights, ascents } = props
    const lines = splitLines(xAdvances, w)

    const baselines: BaseLineInfo[] = []
    let firstCharacter = 0;
    let endCharacter = 0;
    let lineHeightSum = 0
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        endCharacter = firstCharacter + line.length
        const lineWidth = line.reduce((pre, cur) => pre + cur, 0)
        const lineHeight = Math.max(...advanceHeights.slice(firstCharacter, endCharacter))
        const lineAscent = Math.max(...ascents.slice(firstCharacter, endCharacter))

        baselines.push({
            position: {
                x: 0,
                y: lineHeightSum + lineAscent
            },
            lineY: lineHeightSum,
            width: lineWidth,
            firstCharacter,
            endCharacter,
            lineHeight: Math.round(lineHeight),
            lineAscent: Math.round(lineAscent)
        })
        firstCharacter = endCharacter
        lineHeightSum += lineHeight
    }
    return baselines;
}