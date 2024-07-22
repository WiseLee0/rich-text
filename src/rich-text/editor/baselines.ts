import { EditorInterface, MetricesInterface, splitBaseLines } from "..";

export const getBaselines: EditorInterface['getBaselines'] = (editor) => {
    if (editor.derivedTextData.baselines) return editor.derivedTextData.baselines
    const baselines = []

    const lines = splitBaseLines(editor, editor.width + 0.1)
    if (!lines) return;

    let firstCharacter = 0;
    let endCharacter = 0;
    let lineHeightSum = 0
    const lineHeights = lines.map(line => line.reduce((pre, cur) => Math.max(pre, cur.height), 0))
    const allLineHeight = lineHeights.reduce((pre, cur) => pre + cur, 0)

    const { textAlignHorizontal, textAlignVertical } = editor.style

    if (textAlignVertical === 'TOP') {
        lineHeightSum = 0
    }
    if (textAlignVertical === 'MIDDLE') {
        lineHeightSum = (editor.height - allLineHeight) / 2
    }
    if (textAlignVertical === 'BOTTOM') {
        lineHeightSum = editor.height - allLineHeight
    }


    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        endCharacter = firstCharacter + getMetricesLength(line)
        const lineWidth = line.reduce((pre, cur) => pre + cur.xAdvance, 0)
        const lineHeight = lineHeights[i]
        const lineAscent = line.reduce((pre, cur) => Math.max(pre, cur.ascent), 0)
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

        baselines.push({
            position: {
                x: positionX,
                y: lineHeightSum + lineAscent
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
