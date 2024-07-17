import { EditorInterface } from "..";

export const getBaselines: EditorInterface['getBaselines'] = (editor) => {
    if (editor.__baselines) return editor.__baselines
    const metrices = editor.__matrices ?? editor.getMetrices()
    if (!metrices) return;
    editor.__baselines = []

    const lines = editor.splitLines(editor.width + 0.1)
    if (!lines) return;

    let firstCharacter = 0;
    let endCharacter = 0;
    let lineHeightSum = 0
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        endCharacter = firstCharacter + editor.transformCharactersOffset(line, line.length)
        const lineWidth = line.reduce((pre, cur) => pre + cur.xAdvance, 0)
        const lineHeight = line.reduce((pre, cur) => Math.max(pre, cur.height), 0)
        const lineAscent = line.reduce((pre, cur) => Math.max(pre, cur.ascent), 0)

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