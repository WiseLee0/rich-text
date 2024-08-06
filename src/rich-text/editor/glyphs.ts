import { EditorInterface, GlyphsInterface, baselineToMetricesRange, calcJustifiedSpaceWidth } from "..";

export const getGlyphs: EditorInterface['getGlyphs'] = (editor) => {
    if (editor.derivedTextData.glyphs) return editor.derivedTextData.glyphs
    const metrices = editor.getMetrices()
    const baselines = editor.getBaselines()
    if (!metrices?.length || !baselines?.length) return;
    const glyphs: GlyphsInterface[] = []
    // 是否需要应用截断文本
    let hasTextTruncation = false
    let textWidth = editor.width
    if (editor.style.textAutoResize === 'WIDTH_AND_HEIGHT') {
        textWidth = Math.max(...baselines.map(item => item.width), 0)
    }
    // 在固定宽高模式下，截断文本最大行数设置
    if (editor.style.textAutoResize === 'NONE') {
        let maxLines = editor.style.maxLines
        for (let i = 0; i < baselines.length; i++) {
            const baseline = baselines[i];
            if (baseline.lineY + baseline.lineHeight <= editor.height) {
                maxLines = i + 1
                continue
            }
            break;
        }
        // 如果在最后一行，则省略文本不生效
        if (maxLines === baselines.length) maxLines = baselines.length + 1
        editor.setStyle({
            maxLines
        })
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
            if (!hasTextTruncation && editor.style.textTruncation === 'ENABLE' && editor.style.maxLines - 1 === i) {
                if (editor.__truncation_metrice?.has(fontKey)) {
                    const truncationMetrice = editor.__truncation_metrice.get(fontKey)!
                    // 省略号宽度
                    const truncationLen = truncationMetrice.xAdvance * 3
                    // Rule1: 文本宽度 - 省略号宽度 < 当前字符x位置；需要遮挡部分字符
                    const isTruncation = textWidth - truncationLen < x
                    // Rule2: 最大截断行数 < 文本行数；到结尾还不符合Rule1，则尝试当前Rule2
                    const isTruncationMaxLines = j === line.length - 1 && i < baselines.length - 1

                    // 处理Rule1
                    if (isTruncation) {
                        const temp = glyphs.pop()
                        const truncationGlyph = {
                            commandsBlob: truncationMetrice.path,
                            position: {
                                x: x - metrice.xAdvance,
                                y: baseline.position.y
                            },
                            fontSize: truncationMetrice.fontSize,
                            xAdvance: truncationMetrice.xAdvance
                        }
                        glyphs.push(truncationGlyph)
                        hasTextTruncation = true
                        editor.style.truncatedHeight = baseline.lineHeight + baseline.lineY
                        editor.style.truncationStartIndex = glyphs.length
                        if (temp) glyphs.push(temp)

                    }
                    // 处理Rule2
                    else if (isTruncationMaxLines) {
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
                        editor.style.truncatedHeight = baseline.lineHeight + baseline.lineY
                        editor.style.truncationStartIndex = glyphs.length
                    }
                }
            }
        }
    }
    // 不需要应用截断文本
    if (!hasTextTruncation) {
        editor.style.truncatedHeight = -1
        editor.style.truncationStartIndex = -1
    }
    editor.derivedTextData.glyphs = glyphs
    return glyphs
}