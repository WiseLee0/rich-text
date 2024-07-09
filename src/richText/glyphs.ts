import type { BaseLineInfo, MetricesInfo, GlyphsInfo } from "./type";

type GlyphsProps = {
    baselines: BaseLineInfo[]
    metrices: MetricesInfo
}
export const getGlyphs = (props: GlyphsProps) => {
    const { baselines, metrices } = props
    const { xAdvances, fontSizes, paths } = metrices
    const glyphs: GlyphsInfo[] = []
    for (let i = 0; i < baselines.length; i++) {
        const baseline = baselines[i];
        const { firstCharacter, endCharacter } = baseline
        const xAdvanceList = xAdvances.slice(firstCharacter, endCharacter)
        let x = baseline.position.x
        for (let j = 0; j < xAdvanceList.length; j++) {
            const xAdvance = xAdvanceList[j];
            glyphs.push({
                commandsBlob: paths[firstCharacter + j],
                position: {
                    x,
                    y: baseline.position.y
                },
                fontSize: fontSizes[firstCharacter + j],
                firstCharacter: firstCharacter + j
            })
            x += xAdvance;
        }
    }
    return glyphs
}