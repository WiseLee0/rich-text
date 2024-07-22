import { Rect, SelectionInterface } from "..";

export const getSelectionRects: SelectionInterface['getSelectionRects'] = (editor) => {
    const { anchor, focus, anchorOffset, focusOffset } = editor.getSelection()
    const baselines = editor.getBaselines()
    const text = editor.getText()
    if (!editor.hasSelection()) return [];
    if (!baselines?.length) {
        return [[0, 0, 1, editor.style.fontSize]]
    }

    const result: Rect[] = []

    if (text === '\n') {
        const lastBaseLine = baselines[0]
        const { lineY, lineHeight } = lastBaseLine
        const startX = lastBaseLine.position.x
        result.push([startX, lineY, 1, lineHeight])
        return result
    }
    if (focus === baselines.length && editor.isCollapse()) {
        const lastBaseLine = baselines[baselines.length - 1]
        const { lineY, lineHeight } = lastBaseLine
        const startX = lastBaseLine.position.x
        result.push([startX, lineY + lineHeight, 1, lineHeight])
        return result
    }

    if (focus === anchor) {
        const baseLine = baselines[anchor]
        const startX = baseLine.position.x
        const xArr = editor.getBaseLineCharacterOffset(anchor)?.map(item => startX + item)
        if (!xArr?.length) return result;
        const width = xArr[focusOffset] - (xArr[anchorOffset] - baseLine.position.x)
        result.push([xArr[anchorOffset], baseLine.lineY, width || 1, baseLine.lineHeight])
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
            result.push([0, focusBaseLine.lineY, focusXArr[focusOffset], focusBaseLine.lineHeight])
        }
    }

    if (focus - anchor >= 1) {
        for (let i = anchor + 1; i < focus; i++) {
            const baseline = baselines[i];
            if (baseline) {
                result.push([0, baseline.lineY, editor.width, baseline.lineHeight])
            }
        }
    }
    return result
}