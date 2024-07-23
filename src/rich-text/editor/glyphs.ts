import { EditorInterface, baselineToMetricesRange, calcJustifiedSpaceWidth } from "..";

export const getGlyphs: EditorInterface['getGlyphs'] = (editor) => {
    if (editor.derivedTextData.glyphs) return editor.derivedTextData.glyphs
    const metrices = editor.getMetrices()
    const baselines = editor.getBaselines()
    if (!metrices?.length || !baselines?.length) return;
    const glyphs = []
    for (let i = 0; i < baselines.length; i++) {
        const baseline = baselines[i];
        const { firstCharacter, endCharacter } = baseline
        const [start, end] = baselineToMetricesRange(editor, firstCharacter, endCharacter)
        const line = metrices.slice(start, end)
        let x = baseline.position.x
        let count = 0
        let spaceWidth = i < baselines.length - 1 ? calcJustifiedSpaceWidth(editor, line, firstCharacter, endCharacter) : -1

        for (let j = 0; j < line.length; j++) {
            const metrice = line[j];
            if (metrice.name === '\n') {
                count += metrice.codePoints.length
                continue;
            }
            glyphs.push({
                commandsBlob: metrice.path,
                position: {
                    x,
                    y: baseline.position.y
                },
                fontSize: metrice.fontSize,
                firstCharacter: baseline.firstCharacter + count
            })
            if (metrice.name === 'space' && spaceWidth > -1) x += spaceWidth;
            else x += metrice.xAdvance;
            count += metrice.codePoints.length
        }
    }
    editor.derivedTextData.glyphs = glyphs
    return glyphs
}