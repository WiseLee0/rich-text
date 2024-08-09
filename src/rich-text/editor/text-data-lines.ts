import { Editor, TextDataLinesInterface } from "..";

export const handleInsertTextOfTextDataLine = (editor: Editor, content: string) => {
    const plainData = {
        lineType: "PLAIN",
        indentationLevel: 0,
        isFirstLineOfList: true
    } as TextDataLinesInterface
    const { lines, characters } = editor.textData
    let wrapNum = getWrapNum(content)
    if (!lines?.length) {
        wrapNum += 1
        const result: TextDataLinesInterface[] = []
        for (let i = 0; i < wrapNum; i++) {
            result.push({ ...plainData })
        }
        editor.textData.lines = result
        return false
    }
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    if (!selectCharacterOffset) return false;
    const { anchor } = selectCharacterOffset

    if (content === ' ') {
        // 看前面是否符合激活列表条件
        let symbolStr = ''
        let charIdx = anchor - 1
        while (charIdx >= 0 && characters[charIdx] !== '\n' && symbolStr.length < 4) {
            symbolStr = characters[charIdx] + symbolStr
            charIdx--
        }
        // 有序列表限制 99.
        if (symbolStr.length < 4) {
            // 无序列表
            if (symbolStr === '-' || symbolStr === '*') {
                console.log('无序列表');
                
                return true
            }
            // 有序列表
            if (symbolStr.length > 1) {
                const num = symbolStr.slice(0, -1)
                const symbol = symbolStr[symbolStr.length - 1]
                if ((/^[0-9]+$/.test(num) || /^[a-zA-Z]+$/.test(num)) && (symbol === '.' || symbol === ')')) {
                    console.log('有序列表');

                    return true
                }
            }

        }
    }
    const lineIdx = editor.getLineIndexForCharacterOffset(selectCharacterOffset.anchor) - 1
    const result: TextDataLinesInterface[] = []
    for (let i = 0; i < wrapNum; i++) {
        result.push({ ...lines[lineIdx], isFirstLineOfList: false })
    }
    editor.textData.lines?.splice(lineIdx, 0, ...result)
}


export const handleDeleteTextOfTextDataLine = (editor: Editor) => {
    const plainData = {
        lineType: "PLAIN",
        indentationLevel: 0,
        isFirstLineOfList: true
    } as TextDataLinesInterface
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    const range = editor.getSelection()
    const { lines } = editor.textData
    if (!selectCharacterOffset || !lines) return false;
    const anchorLineIdx = editor.getLineIndexForCharacterOffset(selectCharacterOffset.anchor)
    const focusLineIdx = editor.getLineIndexForCharacterOffset(selectCharacterOffset.focus)
    const deleteCount = focusLineIdx - anchorLineIdx

    // 在一行内删除
    if (range.anchor === range.focus) {
        // 删除开头
        if (range.anchorOffset === 0 && range.focusOffset === 0) {
            // 存在层级，先移除层级
            if (lines[anchorLineIdx].indentationLevel > 0) {
                lines[anchorLineIdx] = plainData
                return true
            }
            // 删除当前行
            lines?.splice(anchorLineIdx, 1)
        }
        return false
    }

    if (deleteCount <= 0) return false;
    lines?.splice(anchorLineIdx + 1, deleteCount)
    return false
}

const getWrapNum = (str: string) => {
    let count = 0
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '\n') count++
    }
    return count
}