import { EditorInterface, baselineToMetricesRange } from "..";

// 计算每行字符真实的偏移值
export const getLogicalCharacterOffset: EditorInterface['getLogicalCharacterOffset'] = (editor) => {
    if (editor.derivedTextData.logicalCharacterOffset) return editor.derivedTextData.logicalCharacterOffset
    const metrices = editor.getMetrices()
    const baselines = editor.getBaselines()
    const glyphs = editor.getGlyphs()
    if (!baselines?.length || !glyphs?.length || !metrices?.length) return [];
    const logicalCharacterOffset: number[] = []

    for (let i = 0; i < baselines.length; i++) {
        const baseline = baselines[i];
        const { firstCharacter, endCharacter, width } = baseline
        let [start, end] = baselineToMetricesRange(editor, firstCharacter, endCharacter)
        let offset = 0
        for (let j = start; j < end; j++) {
            const metrice = metrices[j];
            if (metrice.isLigature) {
                const step_w = metrice.xAdvance / metrice.codePoints.length
                for (let j = 0; j < metrice.codePoints.length; j++) {
                    logicalCharacterOffset.push(offset + step_w * j)
                }
            } else {
                logicalCharacterOffset.push(offset)
            }
            offset += metrice.xAdvance
        }
       if(width !== 0) logicalCharacterOffset.push(offset)
    }
    editor.derivedTextData.logicalCharacterOffset = logicalCharacterOffset
    return logicalCharacterOffset
}

// 获取当前基线行的宽度列表
export const getBaseLineCharacterOffset: EditorInterface['getBaseLineCharacterOffset'] = (editor, baselineIdx) => {
    const characterOffset = editor.getLogicalCharacterOffset()
    const offset: number[] = []
    let idx = -1
    for (let i = 0; i < characterOffset.length; i++) {
        const item = characterOffset[i];
        if (item === 0) idx++
        if (idx > baselineIdx) break
        if (idx === baselineIdx) {
            offset.push(item)
        }
    }
    return offset
}
