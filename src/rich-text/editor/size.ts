import { EditorInterface } from "..";

// 设置文本宽高
export const setWH: EditorInterface['setWH'] = (editor, width, height) => {
    if (width !== undefined) editor.width = width
    if (height !== undefined) editor.height = height
}

// 获取当前行的宽度列表
export const getLineWidths: EditorInterface['getLineWidths'] = (editor, baselineY) => {
    const metrices = editor.getMetrices()
    const baselines = editor.getBaselines()
    const glyphs = editor.getGlyphs()
    if (!baselines || !glyphs || !metrices) return;
    const xArr: number[] = []
    const { firstCharacter, endCharacter, position, width } = baselines[baselineY]
    const [start, end] = editor.transformMetricesRange(firstCharacter, endCharacter)
    for (let i = start; i < end; i++) {
        const metrice = metrices[i]
        const glyph = glyphs[i]
        if (metrice.isLigature) {
            const step_w = metrice.xAdvance / metrice.codePoints.length
            for (let j = 0; j < metrice.codePoints.length; j++) {
                xArr.push(glyph.position.x + step_w * j)
            }
        } else {
            xArr.push(glyph.position.x)
        }
    }
    xArr.push(position.x + width)
    return xArr
}