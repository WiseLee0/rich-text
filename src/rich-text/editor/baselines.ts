import { Editor, EditorInterface, MetricesInterface, splitBaseLines } from "..";

export const getBaselines: EditorInterface['getBaselines'] = (editor) => {
    if (editor.__baselines) return editor.__baselines
    editor.__baselines = []

    const lines = splitBaseLines(editor, editor.width + 0.1)
    if (!lines) return;

    let firstCharacter = 0;
    let endCharacter = 0;
    let lineHeightSum = 0

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        endCharacter = firstCharacter + getMetricesLength(line)
        const lineWidth = line.reduce((pre, cur) => pre + cur.xAdvance, 0)
        const lineHeight = line.reduce((pre, cur) => Math.max(pre, cur.height), 0)
        const lineAscent = line.reduce((pre, cur) => Math.max(pre, cur.ascent), 0)
        if (line.length !== 1 && lineWidth === 0 && line[0].name === '\n') {
            firstCharacter = endCharacter
            continue
        }
        editor.__baselines.push({
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
    return editor.__baselines
}

const getMetricesLength = (metrices: MetricesInterface[]) => {
    let len = 0
    for (let i = 0; i < metrices.length; i++) {
        const metrice = metrices[i];
        len += metrice.codePoints.length
    }
    return len
}


// 获取当前基线行的宽度列表
export const getBaseLineWidths: EditorInterface['getBaseLineWidths'] = (editor, baselineIdx) => {
    const metrices = editor.getMetrices()
    const baselines = editor.getBaselines()
    const glyphs = editor.getGlyphs()
    if (!baselines?.length || !glyphs?.length || !metrices?.length) return;
    const xArr: number[] = []
    const { firstCharacter, endCharacter, position, width } = baselines[baselineIdx]
    const [start, end] = editor.transformMetricesRange(firstCharacter, endCharacter)
    const glyphMap = new Map()
    for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        glyphMap.set(glyph.firstCharacter, glyph)
    }
    for (let i = start; i < end; i++) {
        const metrice = metrices[i]
        if (metrice.name === "\n") continue;
        const glyph = glyphMap.get(metrice.firstCharacter)
        if (!glyph) {
            console.warn('getBaseLineWidths exception')
            continue;
        }
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
