import { getLineIndentationLevelPixels, Rect, SelectionInterface } from "..";

export const getSelectionRects: SelectionInterface['getSelectionRects'] = (editor) => {
    const { anchor, focus, anchorOffset, focusOffset } = editor.getSelection()
    const baselines = editor.getBaselines()
    if (!editor.hasSelection()) return [];

    const lineHeight = editor.getLineHeightOfPixels()

    if (!baselines?.length) {
        return [[0, 0, 1, editor.style.fontSize]]
    }

    const result: Rect[] = []

    // if (text === '\n') {
    //     const lastBaseLine = baselines[0]
    //     const { lineY, lineHeight } = lastBaseLine
    //     const startX = lastBaseLine.position.x
    //     result.push([startX, lineY, 1, lineHeight])
    //     return result
    // }
    if (anchor === baselines.length && anchorOffset === 0) {
        const lastBaseLine = baselines[baselines.length - 1]
        const { lineY, lineHeight } = lastBaseLine
        const indentationLevel = editor.textData.lines?.[editor.textData.lines?.length - 1].indentationLevel ?? 0
        let startX = 0
        if (indentationLevel > 0) {
            const style = editor.getStyle()
            startX = indentationLevel * style.fontSize * 1.5
        }
        const diffY = (lineHeight - lastBaseLine.lineHeight) / 2
        result.push([startX, (lineY + lastBaseLine.lineHeight) - diffY, 1, lineHeight])
        return result
    }

    if (focus === anchor) {
        const baseLine = baselines[anchor]
        const startX = baseLine.position.x
        const xArr = editor.getBaseLineCharacterOffset(anchor)?.map(item => startX + item)
        if (!xArr?.length) return result;
        const width = xArr[focusOffset] - xArr[anchorOffset]
        const diffY = (lineHeight - baseLine.lineHeight) / 2
        if (anchorOffset === focusOffset) {
            result.push([xArr[anchorOffset], baseLine.lineY - diffY + 2, width || 1, lineHeight])
        } else {
            result.push([xArr[anchorOffset], baseLine.lineY - diffY, width || 1, lineHeight])
        }
    }


    if (focus > anchor) {
        const anchorBaseLine = baselines[anchor]
        const anchorStartX = anchorBaseLine.position.x
        const anchorXArr = editor.getBaseLineCharacterOffset(anchor)?.map(item => anchorStartX + item)
        if (!anchorXArr?.length) return result;
        result.push([anchorXArr[anchorOffset], anchorBaseLine.lineY, editor.width - anchorXArr[anchorOffset], anchorBaseLine.lineHeight])

        const focusBaseLine = baselines[focus]
        if (focusBaseLine) {
            const focusXArr = editor.getBaseLineCharacterOffset(focus)
            if (!focusXArr?.length) return result;
            const startX = getLineIndentationLevelPixels(editor, focusBaseLine.firstCharacter)
            result.push([startX, focusBaseLine.lineY, focusXArr[focusOffset] + focusBaseLine.position.x - startX, focusBaseLine.lineHeight])
        }
    }

    if (focus - anchor >= 1) {
        for (let i = anchor + 1; i < focus; i++) {
            const baseline = baselines[i];
            const startX = getLineIndentationLevelPixels(editor, baseline.firstCharacter)
            if (baseline) {
                result.push([startX, baseline.lineY, editor.width - startX, baseline.lineHeight])
            }
        }
    }
    return result
}
