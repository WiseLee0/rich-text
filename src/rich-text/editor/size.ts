import { Editor, EditorInterface } from "..";

// 设置文本宽高
export const setWH: EditorInterface['setWH'] = (editor, width, height) => {
    if (width !== undefined) editor.width = width
    if (height !== undefined) editor.height = height
}

export const getH = (editor: Editor) => {
    const baselines = editor.getBaselines()
    if (!baselines?.length) return 0;
    const lastBaseLine = baselines[baselines.length - 1]
    // 最后一个字符是换行符，则需要添加一段高度
    const characters = editor.getText()
    let wrapHeight = 0
    if (characters.length > 1 && characters[characters.length - 1] === '\n') {
        wrapHeight = lastBaseLine.lineHeight
    }

    const height = lastBaseLine.lineY + lastBaseLine.lineHeight + wrapHeight

    return height
}