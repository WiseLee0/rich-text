import { calcJustifiedBaseLineWidth, EditorInterface, MetricesInterface, splitBaseLines } from "..";

export const getBaselines: EditorInterface['getBaselines'] = (editor) => {
    if (editor.derivedTextData.baselines) return editor.derivedTextData.baselines
    const baselines = []

    const textDataLines = editor.textData.lines
    const lines = splitBaseLines(editor, editor.width + 0.1)
    if (!lines || !textDataLines?.length) return;

    let linesFirstCharacter = editor.getLinesFirstCharacter()
    let firstStyle = editor.getStyle(0)
    let firstCharacter = 0;
    let endCharacter = 0;
    let lineHeightSum = 0
    const lineHeights = lines.map(line => line.reduce((pre, cur) => Math.max(pre, cur.height), 0))
    const allLineHeight = lineHeights.reduce((pre, cur) => pre + cur, 0)
    const lineWidths = lines.map(line => line.reduce((pre, cur) => pre + cur.xAdvance, 0))
    const lineMaxWidth = Math.max(...lineWidths)

    const { textAlignHorizontal, textAlignVertical, textAutoResize, leadingTrim } = editor.style

    if (textAlignVertical === 'TOP') {
        lineHeightSum = 0
    }
    if (textAlignVertical === 'MIDDLE') {
        lineHeightSum = (editor.height - allLineHeight) / 2
    }
    if (textAlignVertical === 'BOTTOM') {
        lineHeightSum = editor.height - allLineHeight
    }
    if (textAutoResize !== 'NONE') {
        lineHeightSum = 0
    }
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        endCharacter = firstCharacter + getMetricesLength(line)
        const lineHeight = lineHeights[i]
        let lineWidth = lineWidths[i]
        const lineAscent = line.reduce((pre, cur) => Math.max(pre, cur.ascent), 0)
        const capHeight = line.reduce((pre, cur) => Math.max(pre, cur.capHeight), 0)
        let positionX = 0
        if (line.length !== 1 && lineWidth === 0 && line[0].name === '\n') {
            firstCharacter = endCharacter
            continue
        }

        if (textAlignHorizontal === 'LEFT') {
            positionX = 0
        }
        if (textAlignHorizontal === 'CENTER') {
            positionX = (editor.width - lineWidth) / 2
        }
        if (textAlignHorizontal === 'RIGHT') {
            positionX = editor.width - lineWidth
        }
        if (textAlignHorizontal === 'JUSTIFIED') {
            positionX = 0
            const justifiedLineWidth = calcJustifiedBaseLineWidth(editor, lines, i, firstCharacter, endCharacter)
            if (justifiedLineWidth > -1) lineWidth = justifiedLineWidth
        }
        if (textAutoResize === 'WIDTH_AND_HEIGHT') {

            if (textAlignHorizontal === 'CENTER') {
                positionX = (lineMaxWidth - lineWidth) / 2
            }
            if (textAlignHorizontal === 'RIGHT') {
                positionX = lineMaxWidth - lineWidth
            }
        }

        let leadingTrimY = 0
        if (leadingTrim === 'CAP_HEIGHT' && i === 0 && textAutoResize !== 'NONE') {
            lineHeightSum -= (lineAscent - capHeight)
        } else if (leadingTrim === 'CAP_HEIGHT' && textAutoResize === 'NONE') {
            if (textAlignVertical === 'TOP') {
                leadingTrimY -= (lineAscent - capHeight)
            } else if (textAlignVertical === 'MIDDLE') {
                leadingTrimY -= (lineAscent - capHeight) / 2
                leadingTrimY += (lineHeight - lineAscent) / 2
            } else if (textAlignVertical === 'BOTTOM') {
                leadingTrimY += lineHeight - lineAscent
            }
        }

        // 处理缩进层级
        const lineFirstCharacter = line[0].firstCharacter
        const lineIdx = editor.getLineIndexForCharacterOffset(lineFirstCharacter)
        if (linesFirstCharacter.includes(lineFirstCharacter)) {
            firstStyle = editor.getLineStyleForCharacterOffset(lineFirstCharacter)
        }
        const textDataLine = textDataLines[lineIdx]
        if (textDataLine?.indentationLevel > 0) {
            positionX += textDataLine.indentationLevel * firstStyle.fontSize * 1.5
        }

        baselines.push({
            position: {
                x: positionX,
                y: lineHeightSum + lineAscent + leadingTrimY
            },
            lineY: lineHeightSum,
            width: lineWidth,
            firstCharacter,
            endCharacter,
            lineHeight,
            lineAscent
        })

        firstCharacter = endCharacter
        lineHeightSum += lineHeight
    }
    editor.derivedTextData.baselines = baselines
    return baselines
}

const getMetricesLength = (metrices: MetricesInterface[]) => {
    let len = 0
    for (let i = 0; i < metrices.length; i++) {
        const metrice = metrices[i];
        len += metrice.codePoints.length
    }
    return len
}