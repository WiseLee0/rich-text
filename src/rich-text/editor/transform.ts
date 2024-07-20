import { Editor } from ".."

// 转换成度量信息的偏移值
export const baselineToMetricesRange = (editor: Editor, firstCharacter: number, endCharacter: number) => {
    const metrices = editor.getMetrices()
    const result = [-1, -1] as [number, number]
    if (!metrices) return result
    for (let i = 0; i < metrices.length; i++) {
        const metrice = metrices[i]
        if (metrice.firstCharacter === firstCharacter) result[0] = i
        if (metrice.firstCharacter === endCharacter) result[1] = i
        if (result[0] !== -1 && result[1] !== -1) break;
    }
    if (result[1] === -1) result[1] = metrices.length
    if (result[0] === -1) {
        console.warn('baselineToMetricesRange expection')
    }
    return result
}