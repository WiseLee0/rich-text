import { Editor, getFontLineHeight } from "..";

export const getH = (editor: Editor) => {
    const baselines = editor.getBaselines()
    if (!baselines?.length) return getFontLineHeight(editor);
    const { lines } = editor.textData;

    const firstBaseLine = baselines[0]
    const lastBaseLine = baselines[baselines.length - 1]
    // 最后一个字符是换行符，则需要添加一段高度
    const characters = editor.getText()
    let wrapHeight = 0
    if (characters.length > 0 && characters[characters.length - 1] === '\n') {
        wrapHeight = lastBaseLine.lineHeight
    }

    let leadingH = 0
    if (editor.style.leadingTrim === 'CAP_HEIGHT') {
        leadingH -= Math.abs(firstBaseLine.lineAscent - firstBaseLine.capHeight);
        leadingH -= (lastBaseLine.lineHeight - lastBaseLine.lineAscent)
    }

    let paragraphSpacingH = 0
    if (lines) {
        for (let i = 0; i < lines.length - 1; i++) {
            paragraphSpacingH += lines[i].paragraphSpacing;
        }
    }

    // 省略文本
    if (editor.style.textTruncation === 'ENABLE' && editor.style.truncatedHeight > -1) {
        return editor.style.truncatedHeight + leadingH
    }

    let height = wrapHeight + leadingH + paragraphSpacingH
    for (let i = 0; i < baselines.length; i++) {
        height += baselines[i].lineHeight;
    }

    return height
}