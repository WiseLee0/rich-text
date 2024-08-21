import { getLineIndentationLevelPixels, Rect, SelectionInterface } from "..";

export const getSelectionRects: SelectionInterface['getSelectionRects'] = (editor) => {
    const { anchor, focus, anchorOffset, focusOffset } = editor.getSelection()
    const baselines = editor.getBaselines()
    if (!editor.hasSelection()) return [];

    if (!baselines?.length) {
        return [[0, 0, 1, editor.style.fontSize]]
    }

    const result: Rect[] = []

    if (anchor === baselines.length && anchorOffset === 0) {
        const lastBaseLine = baselines[baselines.length - 1]
        const indentationLevel = editor.textData.lines?.[editor.textData.lines?.length - 1].indentationLevel ?? 0
        let startX = 0
        const style = editor.getStyle()
        if (indentationLevel > 0) {
            startX = indentationLevel * style.fontSize * 1.5
        }
        const minY = lastBaseLine.position.y - lastBaseLine.lineAscent + lastBaseLine.lineHeight + style.paragraphSpacing
        result.push([startX, minY, 1, lastBaseLine.lineAscent])
        return result
    }

    if (focus === anchor) {
        const baseLine = baselines[anchor]
        const startX = baseLine.position.x
        const xArr = editor.getBaseLineCharacterOffset(anchor)?.map(item => startX + item)
        if (!xArr?.length) return result;
        const width = xArr[focusOffset] - xArr[anchorOffset]
        if (anchorOffset === focusOffset) {
            const minY = baseLine.position.y - baseLine.lineAscent + 2
            result.push([xArr[anchorOffset], minY, width || 1, baseLine.lineAscent])
        } else {
            result.push([xArr[anchorOffset], baseLine.lineY, width || 1, Math.max(baseLine.lineHeight, baseLine.defaultLineHeight)])
        }
    }


    if (focus > anchor) {
        const anchorBaseLine = baselines[anchor]
        const anchorStartX = anchorBaseLine.position.x
        const anchorXArr = editor.getBaseLineCharacterOffset(anchor)?.map(item => anchorStartX + item)
        if (!anchorXArr?.length) return result;

        result.push([anchorXArr[anchorOffset], anchorBaseLine.lineY, editor.width - anchorXArr[anchorOffset], Math.max(anchorBaseLine.lineHeight, anchorBaseLine.defaultLineHeight)])

        const focusBaseLine = baselines[focus]
        if (focusBaseLine) {
            const focusXArr = editor.getBaseLineCharacterOffset(focus)
            if (!focusXArr?.length) return result;
            const startX = getLineIndentationLevelPixels(editor, focusBaseLine.firstCharacter)
            result.push([startX, focusBaseLine.lineY, focusXArr[focusOffset] + focusBaseLine.position.x - startX, Math.max(focusBaseLine.lineHeight, focusBaseLine.defaultLineHeight)])
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
