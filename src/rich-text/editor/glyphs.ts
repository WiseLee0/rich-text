import type { Font } from "fontkit";
import { BaseLineInterface, Editor, EditorInterface, GlyphsInterface, StyleInterface, baselineToMetricesRange, calcJustifiedWordWidth, getDefaultFontIdx, getLineIndentationLevelPixels, getLineIndexForCharacterOffset, getLineStyleID, getLineSymbolContent, getTextArr, isJustifiedChar } from "..";

export const getGlyphs: EditorInterface['getGlyphs'] = (editor) => {
    if (editor.derivedTextData.glyphs) return editor.derivedTextData.glyphs
    const metrices = editor.getMetrices() ?? []
    const baselines = editor.getBaselines() ?? []
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
        editor.style.maxLines = maxLines
    }

    const lineSymbolVisit = new Array(editor.textData.lines?.length ?? 0).fill(0)
    const { paragraphIndent } = editor.style;

    for (let i = 0; i < baselines.length; i++) {
        const baseline = baselines[i];
        const { firstCharacter, endCharacter } = baseline
        const [start, end] = baselineToMetricesRange(editor, firstCharacter, endCharacter)
        const line = metrices.slice(start, end)
        let x = baseline.position.x
        let count = 0
        // 对齐词组宽度
        let wordWidth = i < baselines.length - 1 ? calcJustifiedWordWidth(editor, line, baseline.width) : -1
        const endStyle = editor.getStyle(baseline.endCharacter - 1)
        let endFont = editor.getFont(endStyle.fontName.family, endStyle.fontName.style)
        if (Object.keys(endStyle.fontVariations)?.length) endFont = endFont?.getVariation(endStyle.fontVariations)

        // 添加列表符号
        const lineIdx = getLineIndexForCharacterOffset(editor, firstCharacter)
        if (lineSymbolVisit[lineIdx] === 0) {
            addListSymbol(editor, glyphs, lineIdx, baseline)
            lineSymbolVisit[lineIdx] = 1
        }

        for (let j = 0; j < line.length; j++) {
            const metrice = line[j];
            if (metrice.name !== '\n') {
                let y = baseline.position.y
                if (metrice.name === 'isEmoji') {
                    glyphs.push({
                        commandsBlob: metrice.path,
                        position: {
                            x,
                            y
                        },
                        fontSize: metrice.fontSize,
                        firstCharacter: baseline.firstCharacter + count,
                        emojiCodePoints: metrice.codePoints,
                        emojiRect: [x, y - metrice.fontSize * 0.9, x + metrice.xAdvance, y + metrice.fontSize * 0.1]
                    })
                } else {
                    glyphs.push({
                        commandsBlob: metrice.path,
                        position: {
                            x,
                            y
                        },
                        fontSize: metrice.fontSize,
                        firstCharacter: baseline.firstCharacter + count
                    })
                }
                if (wordWidth > -1 && isJustifiedChar(metrice)) x += wordWidth + metrice.xAdvance;
                else x += metrice.xAdvance;
            }
            count += metrice.codePoints.length

            // 截断文本处理
            if (!hasTextTruncation && editor.style.textTruncation === 'ENABLE' && editor.style.maxLines - 1 === i) {
                if (endFont) {
                    const { glyphs: fontGlyphs, positions } = endFont.layout('.')
                    const glyph = fontGlyphs[0]
                    const fontSize = endStyle?.fontSize ?? editor.style.fontSize
                    let unitsPerPx = fontSize / (endFont.unitsPerEm || 1000);
                    const xAdvance = positions[0].xAdvance * unitsPerPx
                    const path = glyph.path.scale(unitsPerPx, -unitsPerPx).toSVG()
                    // 省略号宽度
                    const truncationLen = xAdvance * 3
                    // Rule1: 文本宽度 - 省略号宽度 < 当前字符x位置；需要遮挡部分字符
                    const isTruncation = textWidth - truncationLen < x
                    // Rule2: 最大截断行数 < 文本行数；到结尾还不符合Rule1，则尝试当前Rule2
                    const isTruncationMaxLines = j === line.length - 1 && i < baselines.length - 1

                    // 处理Rule1
                    if (isTruncation) {
                        const temp = glyphs.pop()
                        const truncationGlyph = {
                            commandsBlob: path,
                            position: {
                                x: x - metrice.xAdvance,
                                y: baseline.position.y
                            },
                            fontSize,
                            xAdvance
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
                            commandsBlob: path,
                            position: {
                                x,
                                y: baseline.position.y
                            },
                            fontSize,
                            xAdvance
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

    // 空文本存在列表符号时
    if (!editor.textData.characters.length && !baselines.length) {
        if (lineSymbolVisit[0] === 0) {
            let startX = getLineIndentationLevelPixels(editor, 0) + editor.style.paragraphIndent
            let startY = editor.style.fontSize
            if (editor.style.textAlignVertical === 'MIDDLE') {
                startY = (editor.height + editor.style.fontSize * 0.7) / 2
            }
            if (editor.style.textAlignVertical === 'BOTTOM') {
                startY = editor.height - editor.style.fontSize * 0.3
            }
            if (editor.style.textAlignHorizontal === 'CENTER') {
                startX = (startX + editor.width) / 2
            }
            if (editor.style.textAlignHorizontal === 'RIGHT') {
                startX = editor.width
            }
            const endLine = {
                position: {
                    x: startX,
                    y: startY
                },
                width: 0,
                lineY: editor.style.fontSize,
                lineHeight: editor.style.fontSize,
                defaultLineHeight: editor.style.fontSize,
                lineAscent: editor.style.fontSize,
                firstCharacter: -1,
                endCharacter: 0,
                capHeight: 0,
            } as BaseLineInterface
            addListSymbol(editor, glyphs, 0, endLine)
            lineSymbolVisit[0] = 1
        }
    }
    // 最后一个字符是换行，存在列表符号时
    if (editor.textData.characters[editor.textData.characters.length - 1] === '\n') {
        const lastLen = getTextArr(editor).length
        const lineIdx = getLineIndexForCharacterOffset(editor, lastLen)
        if (lineSymbolVisit[lineIdx] === 0) {
            const endBaseLine = baselines[baselines.length - 1];
            const lineY = endBaseLine.lineY + endBaseLine.lineHeight
            let startX = getLineIndentationLevelPixels(editor, endBaseLine.endCharacter) + editor.style.paragraphIndent
            if (editor.style.textAlignHorizontal === 'CENTER') {
                startX = (startX + editor.width) / 2
            }
            if (editor.style.textAlignHorizontal === 'RIGHT') {
                startX = editor.width
            }
            const endLine = {
                position: {
                    x: startX,
                    y: lineY + endBaseLine.lineAscent
                },
                width: 0,
                lineY: editor.style.fontSize,
                lineHeight: endBaseLine.lineHeight,
                defaultLineHeight: endBaseLine.defaultLineHeight,
                lineAscent: endBaseLine.lineAscent,
                firstCharacter: lastLen - 1,
                endCharacter: lastLen,
                capHeight: endBaseLine.capHeight,
            } as BaseLineInterface
            addListSymbol(editor, glyphs, lineIdx, endLine)
            lineSymbolVisit[lineIdx] = 1
        }
    }
    // 不需要应用截断文本
    if (!hasTextTruncation) {
        if (editor.style.truncatedHeight !== -1) {
            editor.style.truncatedHeight = -1
        }
        if (editor.style.truncationStartIndex !== -1) {
            editor.style.truncationStartIndex = -1
        }
    }
    editor.derivedTextData.glyphs = glyphs
    return glyphs
}

const addListSymbol = (editor: Editor, glyphs: GlyphsInterface[], lineIdx: number, baseline: BaseLineInterface) => {
    const lines = editor.textData.lines;
    const line = editor.textData.lines?.[lineIdx]
    if (!line || !lines?.length) return;

    const styleID = getLineStyleID(editor, baseline.firstCharacter)
    const firstStyle = editor.getStyleForStyleID(styleID)
    let font = editor.getFont(firstStyle.fontName.family, firstStyle.fontName.style)
    if (Object.keys(firstStyle.fontVariations)?.length) font = font?.getVariation(firstStyle.fontVariations)
    if (!font) return;

    let lineListOffset = 0
    let listStartOffset = line.listStartOffset
    if (line.isFirstLineOfList === false) {
        for (let i = lineIdx; i >= 0; i--) {
            if (lines[i].lineType !== line.lineType) {
                lineListOffset--;
                break;
            }
            if (lines[i].indentationLevel === line.indentationLevel) {
                if (lines[i].isFirstLineOfList === true) {
                    listStartOffset = lines[i].listStartOffset
                    break
                }
                lineListOffset++
            }
        }
    }

    const content = getLineSymbolContent(line.lineType, line.indentationLevel, listStartOffset, lineListOffset)

    if (content.length) {
        const fontGlyphs = font.glyphsForString(content)
        const textWidth = fontGlyphs.reduce((pre, cur) => cur.advanceWidth + pre, 0)
        let x = baseline.position.x
        if (!hasGlyph(font, fontGlyphs)) {
            useDefaultFont(editor, glyphs, content, firstStyle, styleID, baseline)
            return
        }


        for (let i = 0; i < fontGlyphs.length; i++) {
            let fontGlyph = fontGlyphs[i];
            const fontSize = firstStyle?.fontSize ?? editor.style.fontSize
            let unitsPerPx = fontSize / (font.unitsPerEm || 1000);
            const xAdvance = fontGlyph.advanceWidth * unitsPerPx
            const path = fontGlyph.path.scale(unitsPerPx, -unitsPerPx).toSVG()
            const symbolGlyph = {
                commandsBlob: path,
                position: {
                    x: x - (textWidth * unitsPerPx) - (fontSize * 1.5) / 4,
                    y: baseline.position.y
                },
                fontSize,
                styleID
            }
            x += xAdvance
            glyphs.push(symbolGlyph)
        }
    }

}

const hasGlyph = (font: Font, fontGlyphs: ReturnType<Font['getGlyph']>[]) => {
    for (let i = 0; i < fontGlyphs.length; i++) {
        if (!font.hasGlyphForCodePoint(fontGlyphs[i].codePoints[0])) return false
    }
    return true
}

const useDefaultFont = (editor: Editor, glyphs: GlyphsInterface[], content: string, firstStyle: StyleInterface, styleID: number, baseline: BaseLineInterface) => {
    const font = editor.getFonts('__default')?.[0]
    if (!font) return

    let textWidth = 0
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const glyphIdx = getDefaultFontIdx(char)
        if (glyphIdx === -1) continue
        const fontGlyph = font.getGlyph(glyphIdx)
        textWidth += fontGlyph.advanceWidth
    }

    let x = baseline.position.x
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const glyphIdx = getDefaultFontIdx(char)
        if (glyphIdx === -1) continue
        const fontGlyph = font.getGlyph(glyphIdx)
        const fontSize = firstStyle?.fontSize ?? editor.style.fontSize
        let unitsPerPx = fontSize / (font.unitsPerEm || 1000);
        const xAdvance = fontGlyph.advanceWidth * unitsPerPx
        const path = fontGlyph.path.scale(unitsPerPx, -unitsPerPx).toSVG()
        const symbolGlyph = {
            commandsBlob: path,
            position: {
                x: x - fontSize * 1.5 / 2 - (textWidth * unitsPerPx) / 2,
                y: baseline.position.y
            },
            fontSize,
            styleID
        }
        x += xAdvance
        glyphs.push(symbolGlyph)
    }
}