import { BaseLineInterface, calcJustifiedBaseLineWidth, Editor, EditorInterface, getLineFirstCharacterList, getLineIndentationLevelPixels, getLineStyleID, getParagraphSpacingForCharacterOffset, MetricesInterface, splitBaseLines, StyleInterface } from "..";

export const getBaselines: EditorInterface['getBaselines'] = (editor) => {
    if (editor.derivedTextData.baselines) return editor.derivedTextData.baselines
    const baselines = []

    const textDataLines = editor.textData.lines
    const lines = splitBaseLines(editor, editor.width + 0.1)
    if (!lines || !textDataLines?.length) return;

    let firstCharacter = 0;
    let endCharacter = 0;
    let lineHeightSum = 0
    const defaultLineHeights = lines.map(line => line.reduce((pre, cur) => Math.max(pre, cur.height), 0))
    const paragraphSpacingSum = textDataLines.slice(0, -1).reduce((pre, cur) => pre + cur.paragraphSpacing, 0);
    const lineHeights = lines.map(line => line.reduce((pre, cur) => Math.max(pre, getLineHeight(editor, cur)), 0))
    let allLineHeight = lineHeights.reduce((pre, cur) => pre + cur, 0)
    const lineWidths = lines.map(line => line.reduce((pre, cur) => pre + cur.xAdvance, 0))
    const lineMaxWidth = Math.max(...lineWidths)

    const { textAlignHorizontal, textAlignVertical, textAutoResize, leadingTrim, paragraphIndent } = editor.style

    // 如果最后一个字符是换行
    if (editor.textData.characters[editor.textData.characters.length - 1] === '\n') {
        allLineHeight += defaultLineHeights[defaultLineHeights.length - 1] ?? editor.getStyle().fontSize
    }
    if (paragraphSpacingSum > 0) {
        allLineHeight += paragraphSpacingSum
    }

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
    const lineFirstCharacterList = getLineFirstCharacterList(editor)

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        endCharacter = firstCharacter + getMetricesLength(line)
        const lineHeight = lineHeights[i]
        const defaultLineHeight = defaultLineHeights[i]
        const lineHeightY = (lineHeight - defaultLineHeight) / 2

        let lineWidth = lineWidths[i]
        const lineAscent = line.reduce((pre, cur) => Math.max(pre, cur.ascent), 0)
        const capHeight = line.reduce((pre, cur) => Math.max(pre, cur.capHeight), 0)
        let positionX = 0
        const lineIndentationLevel = getLineIndentationLevelPixels(editor, line[0].firstCharacter)
        if (line.length !== 1 && lineWidth === 0 && line[0].name === '\n') {
            firstCharacter = endCharacter
            continue
        }
        let needLetterSpacing = true
        // 处理对齐方式
        if (textAlignHorizontal === 'LEFT') {
            positionX = 0
        }
        if (textAlignHorizontal === 'CENTER') {
            positionX = (editor.width - lineIndentationLevel - lineWidth - paragraphIndent) / 2
        }
        if (textAlignHorizontal === 'RIGHT') {
            positionX = editor.width - lineIndentationLevel - lineWidth - paragraphIndent
        }
        if (textAlignHorizontal === 'JUSTIFIED') {
            positionX = 0
            const justifiedLineWidth = calcJustifiedBaseLineWidth(editor, lines, i)
            if (justifiedLineWidth > -1) {
                lineWidth = justifiedLineWidth - lineIndentationLevel - paragraphIndent
                needLetterSpacing = false
            }
        }
        if (textAutoResize === 'WIDTH_AND_HEIGHT') {
            if (textAlignHorizontal === 'CENTER') {
                positionX = (lineMaxWidth - lineWidth) / 2
            }
            if (textAlignHorizontal === 'RIGHT') {
                positionX = lineMaxWidth - lineWidth
            }
        }

        // 处理垂直裁剪
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
        positionX += lineIndentationLevel

        // 处理段落缩进
        if (line[0].name !== '\n' && lineFirstCharacterList.includes(firstCharacter)) {
            if (paragraphIndent >= lineMaxWidth) {
                lineHeightSum += lineHeight
            } else {
                positionX += paragraphIndent
            }
        }

        // 处理段落间距
        if (lineFirstCharacterList.includes(firstCharacter) && lineFirstCharacterList[0] !== firstCharacter) {
            lineHeightSum += getParagraphSpacingForCharacterOffset(editor, Math.max(firstCharacter - 1, 0));
        }

        // 处理lineY
        let lineY = lineHeightSum
        if (lineHeightY < 0) {
            lineY += lineHeightY
        }

        // 处理字间距
        if (needLetterSpacing) {
            if (line[line.length - 1].name === '\n') {
                lineWidth -= line[line.length - 2]?.letterSpacing ?? 0
            } else {
                lineWidth -= line[line.length - 1]?.letterSpacing ?? 0
            }
        }

        baselines.push({
            position: {
                x: positionX,
                y: lineHeightSum + lineAscent + leadingTrimY + lineHeightY
            },
            lineY,
            width: lineWidth,
            firstCharacter,
            endCharacter,
            defaultLineHeight,
            lineHeight,
            lineAscent,
            capHeight
        } as BaseLineInterface)

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

const getLineHeight = (editor: Editor, metrice: MetricesInterface) => {
    const { characterStyleIDs, styleOverrideTable } = editor.textData
    const styleID = characterStyleIDs?.[metrice.firstCharacter]
    const style = styleOverrideTable?.find(item => item.styleID === styleID);
    const lineHeight = (style?.lineHeight ?? editor.style.lineHeight) as StyleInterface['lineHeight'];
    if (lineHeight.units === "RAW") {
        return (lineHeight.value / 100) * metrice.fontSize
    }

    if (lineHeight.units === "PERCENT") {
        return (lineHeight.value / 100) * metrice.height
    }

    return lineHeight.value
}