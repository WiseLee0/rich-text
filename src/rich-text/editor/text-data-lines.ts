import { Editor, getLineFirstCharacterList, getLineIndexForCharacterOffset, getTextArr, mergeStyleOverride, TextDataLinesInterface } from "..";

export const handleInsertTextOfTextDataLine = (editor: Editor, content: string) => {
    const plainData = {
        lineType: "PLAIN",
        indentationLevel: 0,
        isFirstLineOfList: true,
        listStartOffset: 0,
        paragraphSpacing: 0
    } as TextDataLinesInterface
    const { lines, characterStyleIDs, styleOverrideTable } = editor.textData
    let wrapNum = getWrapNum(content)
    const result: TextDataLinesInterface[] = []
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
    const textArr = getTextArr(editor)
    const { anchor } = selectCharacterOffset
    const lineIdx = getLineIndexForCharacterOffset(editor, anchor)
    if (content === ' ' && lines[lineIdx].lineType === 'PLAIN') {
        // 看前面是否符合激活列表条件
        let symbolStr = ''
        let charIdx = anchor - 1
        while (charIdx >= 0 && textArr[charIdx] !== '\n' && symbolStr.length < 4) {
            symbolStr = textArr[charIdx] + symbolStr
            charIdx--
        }
        // 有序列表限制 99.
        if (symbolStr.length < 4) {
            const modifyText = () => {
                const newStr = textArr.slice(0, anchor - symbolStr.length).join('') + textArr.slice(anchor).join('')
                editor.replaceText(newStr)
                editor.selectForCharacterOffset(anchor - symbolStr.length)
                if (characterStyleIDs?.[anchor - symbolStr.length] && styleOverrideTable?.length) {
                    characterStyleIDs?.splice(anchor - symbolStr.length, symbolStr.length)
                    mergeStyleOverride(editor, characterStyleIDs, styleOverrideTable)
                }
            }

            // 无序列表
            if (symbolStr === '-' || symbolStr === '*') {
                modifyText()
                editor.setTextList("UNORDERED_LIST")
                return true
            }
            // 有序列表
            if (symbolStr.length > 1) {
                const num = symbolStr.slice(0, -1)
                const symbol = symbolStr[symbolStr.length - 1]
                const isNum = /^[0-9]+$/.test(num)
                if ((isNum || /^[a-zA-Z]+$/.test(num)) && (symbol === '.' || symbol === ')')) {
                    modifyText()
                    editor.setTextList("ORDERED_LIST", isNum ? parseInt(num) - 1 : 0)
                    return true
                }
            }
        }
    }

    // 换行
    if (content[0] === '\n') {
        const lineIdx = getLineIndexForCharacterOffset(editor, anchor)
        // 空行列表再次换行，需要缩减层级
        if (lines[lineIdx].lineType !== 'PLAIN' && (textArr[anchor] === undefined || textArr[anchor] === '\n') && (textArr[anchor - 1] === undefined || textArr[anchor - 1] === '\n')) {
            if (lines[lineIdx].indentationLevel > 1) {
                lines[lineIdx].indentationLevel--
            } else {
                lines[lineIdx].lineType = 'PLAIN'
                lines[lineIdx].isFirstLineOfList = true
                lines[lineIdx].indentationLevel = 0
            }
            fixTextDataLines(lines)
            return true
        }
        let isFirstLineOfList = lines[lineIdx].isFirstLineOfList
        if (lines[lineIdx].lineType !== 'PLAIN') isFirstLineOfList = false
        for (let i = 0; i < wrapNum; i++) {
            result.push({ ...lines[lineIdx], listStartOffset: 0, isFirstLineOfList })
        }
        if (result.length) {
            lines.splice(lineIdx + 1, 0, ...result)
            fixTextDataLines(lines)
        }
        return
    }

    for (let i = 0; i < wrapNum; i++) {
        result.push({ ...lines[lineIdx - 1], isFirstLineOfList: false })
    }
    if (result.length) {
        lines.splice(lineIdx - 1, 0, ...result)
        fixTextDataLines(lines)
    }
}


export const handleDeleteTextOfTextDataLine = (editor: Editor) => {
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    const range = editor.getSelection()
    const { lines } = editor.textData
    if (!selectCharacterOffset || !lines) return false;
    const anchorLineIdx = getLineIndexForCharacterOffset(editor, selectCharacterOffset.anchor)
    const focusLineIdx = getLineIndexForCharacterOffset(editor, selectCharacterOffset.focus)
    const deleteCount = focusLineIdx - anchorLineIdx

    // 在一行内删除
    if (range.anchor === range.focus) {
        // 删除开头
        if (range.anchorOffset === 0 && range.focusOffset === 0) {
            // 存在层级，先移除层级
            if (lines[anchorLineIdx].indentationLevel > 0) {
                if (lines[anchorLineIdx].lineType === 'PLAIN') {
                    editor.reduceIndent()
                    return true
                }
                editor.setTextList("PLAIN")
                return true
            }
            // 第一行第一个
            if (range.anchor === 0) return true;
            // 删除当前行
            lines?.splice(anchorLineIdx, 1)
            fixTextDataLines(lines)
        }
        return false
    }

    // 空行删除
    if (deleteCount === 1 && range.focusOffset === 0) {
        lines?.splice(focusLineIdx, 1)
        fixTextDataLines(lines)
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

export const getLineSymbolContent = (lineType: TextDataLinesInterface['lineType'], indentationLevel: number, listStartOffset: number, lineListOffset: number) => {
    const num = (listStartOffset ?? 0) + lineListOffset + 1
    if (lineType === 'ORDERED_LIST') {
        if (indentationLevel === 1 || indentationLevel === 4) {
            return `${num}.`
        }
        if (indentationLevel === 2 || indentationLevel === 5) {
            return `${convertToLetter(num)}.`
        }
        if (indentationLevel === 3 || indentationLevel === 6) {
            return `${convertToRoman(num)}.`
        }
    }
    if (lineType === 'UNORDERED_LIST') {
        return "•"
    }
    return ''
}

function convertToLetter(num: number) {
    if (num < 1) {
        return 'Invalid number';
    }
    let result = '';
    while (num > 0) {
        const remainder = (num - 1) % 26;
        result = String.fromCharCode(97 + remainder) + result;
        num = Math.floor((num - 1) / 26);
    }
    return result;
}

function convertToRoman(num: number) {
    const romanNumerals = [
        { value: 1000, numeral: 'm' },
        { value: 900, numeral: 'cm' },
        { value: 500, numeral: 'd' },
        { value: 400, numeral: 'cd' },
        { value: 100, numeral: 'c' },
        { value: 90, numeral: 'xc' },
        { value: 50, numeral: 'l' },
        { value: 40, numeral: 'xl' },
        { value: 10, numeral: 'x' },
        { value: 9, numeral: 'ix' },
        { value: 5, numeral: 'v' },
        { value: 4, numeral: 'iv' },
        { value: 1, numeral: 'i' },
    ];

    let roman = '';

    for (let i = 0; i < romanNumerals.length; i++) {
        while (num >= romanNumerals[i].value) {
            roman += romanNumerals[i].numeral;
            num -= romanNumerals[i].value;
        }
    }

    return roman;
}

export const getLineStyleID = (editor: Editor, firstCharacter: number) => {
    const { lines, characterStyleIDs } = editor.textData
    if (!lines?.length) return 0
    let lineIdx = getLineIndexForCharacterOffset(editor, firstCharacter)
    const indentationLevel = lines[lineIdx].indentationLevel;
    while (lineIdx >= 0 && (!lines[lineIdx]?.isFirstLineOfList || lines[lineIdx].indentationLevel > indentationLevel)) {
        lineIdx--
    }
    if (lineIdx < 0) {
        console.warn('getLineStyleID exception');
        return 0
    }
    const offsets = getLineFirstCharacterList(editor)
    return characterStyleIDs?.[offsets[lineIdx]] ?? 0
}

// 整理textDataLines关系
export const fixTextDataLines = (lines: TextDataLinesInterface[]) => {
    if (!lines.length) return;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // 第一个元素只能是true
        if (i === 0 && line.isFirstLineOfList === false) {
            line.isFirstLineOfList = true
            continue;
        }
        for (let j = i - 1; j >= 0; j--) {
            const preLine = lines[j];
            // 上一层级小于当前层级
            if (preLine.indentationLevel < line.indentationLevel) {
                // 当前行只能是第一个
                line.isFirstLineOfList = true
                break;
            }
            // 上一层级等于当前层级
            if ((preLine.indentationLevel === line.indentationLevel) && line.lineType !== 'PLAIN') {
                // 类型不一致，当前行只能是第一个; 类型一致，当前行必然不是第一个
                if (preLine.lineType !== line.lineType) {
                    line.isFirstLineOfList = true;
                } else {
                    line.isFirstLineOfList = false;
                    line.listStartOffset = 0
                }
                break;
            }
            // 还没有找着，当前行必然是第一个
            if (j === 0) line.isFirstLineOfList = true;
        }
    }
}