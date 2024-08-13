import { EditorInterface, TextDataLinesInterface } from "..";

export const setTextList: EditorInterface['setTextList'] = (editor, lineType) => {
    const { lines, characters } = editor.textData
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    const anchor = selectCharacterOffset?.anchor ?? 0
    const focus = selectCharacterOffset?.focus ?? characters.length
    if (!lines) return false;
    const anchorLineIdx = editor.getLineIndexForCharacterOffset(anchor)
    const focusLineIdx = editor.getLineIndexForCharacterOffset(focus)

    for (let i = anchorLineIdx; i < focusLineIdx + 1; i++) {
        setTextDataLine(lines, i, lineType)
    }

}

const setTextDataLine = (lines: TextDataLinesInterface[], idx: number, lineType: TextDataLinesInterface['lineType']) => {
    const line = lines[idx]
    if (!line) return;
    line.lineType = lineType

    // 如果当前isFirstLineOfList状态发生改变，则递归查看下一级isFirstLineOfList是否需要发生变化
    const changeIsFirstLineOfList = () => {
        const nextId = idx + 1
        const nextLine = lines[nextId]
        if (nextLine) {
            setTextDataLine(lines, nextId, nextLine.lineType)
        }
    }

    if (lineType === 'PLAIN') {
        line.isFirstLineOfList = true
        line.indentationLevel = 0
        changeIsFirstLineOfList()
        return;
    }
    // 文本第一次变成列表类型，level + 1
    if (line.indentationLevel === 0) {
        line.indentationLevel = 1
    }

    const preLine = lines[idx - 1]
    if (!preLine) {
        line.isFirstLineOfList = true
        changeIsFirstLineOfList()
        return
    }

    if (preLine.indentationLevel === line.indentationLevel && preLine.lineType === line.lineType) {
        line.isFirstLineOfList = false
        changeIsFirstLineOfList()
        return
    }

    line.isFirstLineOfList = true
    changeIsFirstLineOfList()
}