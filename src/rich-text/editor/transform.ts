import { EditorInterface } from ".."

// 度量信息偏移转换成字符偏移值，处理连字规则
export const transformCharactersOffset: EditorInterface['transformCharactersOffset'] = (_editor, metrices, offset) => {
    let result = 0
    for (let i = 0; i < offset; i++) {
        const metrice = metrices[i]
        if (metrice.isLigature) {
            result += metrice.codePoints.length
        } else {
            result++
        }
    }
    return result
}

// 转换成度量信息的偏移值
export const transformMetricesRange: EditorInterface['transformMetricesRange'] = (editor, firstCharacter: number, endCharacter: number) => {
    const metrices = editor.getMetrices()
    let count = 0
    const result = [-1, -1] as [number, number]
    if (!metrices) return result
    for (let i = 0; i < metrices.length; i++) {
        const metrice = metrices[i]
        if (result[0] < 0 && count >= firstCharacter) result[0] = i
        if (result[1] < 0 && count >= endCharacter) {
            result[1] = i
            return result
        }
        if (metrice.isLigature) {
            count += metrice.codePoints.length
        } else {
            count++
        }
    }
    if (result[0] < 0) result[0] = metrices.length
    if (result[1] < 0) result[1] = metrices.length
    return result
}