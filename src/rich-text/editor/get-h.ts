import { Editor } from "..";

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

    let leadingH = 0
    if (editor.style.leadingTrim === 'CAP_HEIGHT') {
        leadingH = -(lastBaseLine.lineHeight - lastBaseLine.lineAscent)
    }
    const height = lastBaseLine.lineY + Math.max(lastBaseLine.lineHeight, lastBaseLine.defaultLineHeight) + wrapHeight + leadingH

    // 省略文本
    if (editor.style.textTruncation === 'ENABLE' && editor.style.truncatedHeight > -1) {
        return editor.style.truncatedHeight + leadingH
    }

    return height
}