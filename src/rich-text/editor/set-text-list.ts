import { EditorInterface, TextDataLinesInterface } from "..";

export const setTextList: EditorInterface['setTextList'] = (editor, lineType) => {
    const { lines } = editor.textData
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    if (!selectCharacterOffset || !lines) return false;
    const anchorLineIdx = editor.getLineIndexForCharacterOffset(selectCharacterOffset.anchor)
    const focusLineIdx = editor.getLineIndexForCharacterOffset(selectCharacterOffset.focus)

    let isSame = true
    let curType: TextDataLinesInterface['lineType'] | undefined
    for (let i = anchorLineIdx; i < focusLineIdx + 1; i++) {
        if (curType && curType !== lines[i].lineType) {
            isSame = false
            break
        }
        curType = lines[i].lineType
    }


    for (let i = anchorLineIdx; i < focusLineIdx + 1; i++) {
        if (isSame && curType !== 'PLAIN') {
            setTextDataLine(lines, i, 0, 'PLAIN')
            continue
        }
        if (lines[i].lineType === 'PLAIN') {
            setTextDataLine(lines, i, 1, lineType)
            continue
        }
        setTextDataLine(lines, i, lines[i].indentationLevel, lineType)
    }

}

const setTextDataLine = (lines: TextDataLinesInterface[], idx: number, indentationLevel: number, lineType: TextDataLinesInterface['lineType']) => {
    const line = lines[idx]
    line.lineType = lineType
    line.indentationLevel = indentationLevel
    if (lineType === 'PLAIN') {
        line.isFirstLineOfList = true
        return;
    }

    const preLine = lines[idx - 1]
    if (!preLine) {
        line.isFirstLineOfList = true
        return
    }

    if (preLine.indentationLevel === line.indentationLevel && preLine.lineType === line.lineType) {
        line.isFirstLineOfList = false
        return
    }

    line.isFirstLineOfList = true
}