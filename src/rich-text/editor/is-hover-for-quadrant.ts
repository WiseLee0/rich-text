import { EditorInterface } from "..";

export const isHoverForQuadrant: EditorInterface['isHoverForQuadrant'] = (editor, px, py, radius) => {
    const baselines = editor.getBaselines()
    if (!baselines?.length) {
        return false;
    }

    const points = [[px, py], [px - radius, py], [px, py - radius], [px - radius / Math.sqrt(2), py - radius / Math.sqrt(2)]]

    const hoverForXY = (x: number, y: number) => {
        const yIdx = baselines.findIndex(item => item.lineY < y && y < item.lineY + Math.max(item.lineHeight, item.defaultLineHeight))
        if (yIdx === -1) {
            return false;
        }
        const baseline = baselines[yIdx]
        const xArr = editor.getBaseLineCharacterOffset(yIdx)?.map(item => item + baseline.position.x)
        if (!xArr) {
            return false
        }

        const xIdx = xArr.findIndex(item => item > x)
        if (xIdx <= 0) {
            return false
        }
        return true
    }

    for (let i = 0; i < points.length; i++) {
        const [x, y] = points[i]
        if (hoverForXY(x, y)) {
            return true
        }
    }

    return false;
}