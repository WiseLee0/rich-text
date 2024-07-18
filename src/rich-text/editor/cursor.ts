import { EditorInterface, Rect } from ".."

// 获取到光标所在包围盒[x,y,w,h]
export const getCursorRect: EditorInterface['getCursorRect'] = (editor) => {
    const { anchor, focus } = editor.selection
    const baselines = editor.getBaselines()
    if (!editor.hasSelection()) return;
    if (!baselines?.length) {
        return [0, 0, 1, editor.style.fontSize] as Rect
    }
    
    if (editor.isCollapse()) {
        let [anchorY, anchorX] = anchor
        if (anchorY < 0 || anchorX < 0) return;
        const { lineY, lineHeight } = baselines[anchorY]
        const xArr = editor.getLineWidths(anchorY)
        if (!xArr) return;
        const cursorX = xArr[anchorX]
        const cursorY = lineY
        return [cursorX - 0.5, cursorY, 1, lineHeight] as Rect
    }
}