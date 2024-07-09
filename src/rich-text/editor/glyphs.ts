import { EditorInterface } from "..";

export const getGlyphs: EditorInterface['getGlyphs'] = (editor) => {
    if (editor.__glyphs) return editor.__glyphs
    const metrices = editor.getMetrices()
    const baselines = editor.getBaselines()
    if (!metrices || !baselines) return;
    editor.__glyphs = []

    for (let i = 0; i < baselines.length; i++) {
        const baseline = baselines[i];
        const [start, end] = editor.transformMetricesRange(baseline.firstCharacter, baseline.endCharacter)
        const line = metrices.slice(start, end)
        let x = baseline.position.x
        let count = 0
        for (let j = 0; j < line.length; j++) {
            const metrice = line[j];
            editor.__glyphs.push({
                commandsBlob: metrice.path,
                position: {
                    x,
                    y: baseline.position.y
                },
                fontSize: metrice.fontSize,
                firstCharacter: baseline.firstCharacter + count
            })
            x += metrice.xAdvance
            count += metrice.codePoints.length
        }
    }
    return editor.__glyphs
}