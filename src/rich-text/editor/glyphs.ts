import { EditorInterface, GlyphsInterface, baselineToMetricesRange, calcJustifiedSpaceWidth } from "..";

export const getGlyphs: EditorInterface['getGlyphs'] = (editor) => {
    if (editor.derivedTextData.glyphs) return editor.derivedTextData.glyphs
    const metrices = editor.getMetrices()
    const baselines = editor.getBaselines()
    if (!metrices?.length || !baselines?.length) return;
    const glyphs: GlyphsInterface[] = []
    let hasTextTruncation = false
    let textWidth = editor.width
    if (editor.style.textAutoResize === 'WIDTH_AND_HEIGHT') {
        textWidth = Math.max(...baselines.map(item => item.width), 0)
    }
    for (let i = 0; i < baselines.length; i++) {
        const baseline = baselines[i];
        const { firstCharacter, endCharacter } = baseline
        const [start, end] = baselineToMetricesRange(editor, firstCharacter, endCharacter)
        const line = metrices.slice(start, end)
        let x = baseline.position.x
        let count = 0
        // 空格宽度
        let spaceWidth = i < baselines.length - 1 ? calcJustifiedSpaceWidth(editor, line, firstCharacter, endCharacter) : -1
        // 截断文本样式
        const truncationStyle = editor.getStyle(baseline.endCharacter - 1)
        const fontKey = `${truncationStyle.fontName.family}#${truncationStyle.fontName.style}`


        for (let j = 0; j < line.length; j++) {
            const metrice = line[j];
            if (metrice.name !== '\n') {
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
            }
            count += metrice.codePoints.length


            // 截断文本处理
            if (editor.style.textTruncation === 'ENABLE' && editor.style.maxLines - 1 === i) {
                if (hasTextTruncation) continue
                if (editor.__truncation_metrice?.has(fontKey)) {
                    const truncationMetrice = editor.__truncation_metrice.get(fontKey)!
                    const truncationLen = truncationMetrice.xAdvance * 3
                    const isAutoW = j === line.length - 1 && i < baselines.length - 1
                    const isTruncation = textWidth - truncationLen < x

                    if (isTruncation || isAutoW) {
                        editor.style.truncatedHeight = baseline.lineHeight + baseline.lineY
                        editor.style.truncationStartIndex = glyphs[glyphs.length - 1].firstCharacter! + 1
                        const truncationGlyph = {
                            commandsBlob: truncationMetrice.path,
                            position: {
                                x,
                                y: baseline.position.y
                            },
                            fontSize: truncationMetrice.fontSize,
                            xAdvance: truncationMetrice.xAdvance
                        }
                        glyphs.push(truncationGlyph)
                        hasTextTruncation = true
                    }
                }
            }
        }
    }
    if (!hasTextTruncation) {
        editor.style.truncatedHeight = -1
        editor.style.truncationStartIndex = -1
    }
    editor.derivedTextData.glyphs = glyphs
    return glyphs
}