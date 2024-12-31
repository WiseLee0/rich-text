/**
 * Rule1: 仅在宽度固定下生效
 * Rule2: 一行文本宽度 < 固定宽度，自动换行
 * Rule3: 词组之间必须存在空格或者其他非打印字符
 * Rule4: 换行的最后一行即是存在空格，也不会生效
*/

import { Editor, getTextArr, MetricesInterface } from "..";

// [两端对齐] 计算基线宽度
export const calcJustifiedBaseLineWidth = (editor: Editor, lines: MetricesInterface[][], i: number) => {
    const { textAlignHorizontal, textAutoResize } = editor.style
    if (textAlignHorizontal === 'JUSTIFIED') {
        const line = lines[i]
        const haveWrap = line[line.length - 1].name === '\n';
        if (textAutoResize !== 'WIDTH_AND_HEIGHT' && !haveWrap && i < lines.length - 1 && line.length > 1) {
            let isEndSpace = true
            let endSpaceWidth = 0
            for (let j = line.length - 1; j >= 0; j--) {
                const metrice = line[j];
                if (metrice.name === 'space' && isEndSpace) {
                    endSpaceWidth += metrice.xAdvance
                    continue
                } else {
                    isEndSpace = false
                    if (isJustifiedChar(metrice)) {
                        return editor.width + endSpaceWidth
                    }
                }
            }
        }
    }
    return -1
}

// [两端对齐] 计算间距宽度
export const calcJustifiedWordWidth = (editor: Editor, line: MetricesInterface[], baselineW: number) => {
    const { textAlignHorizontal, textAutoResize } = editor.style
    let width = baselineW
    if (textAlignHorizontal === 'JUSTIFIED') {
        const haveWrap = line[line.length - 1].name === '\n';
        if (textAutoResize !== 'WIDTH_AND_HEIGHT' && !haveWrap && line.length > 1) {
            let wordCount = 0
            let isEndSpace = true
            let charactersWidth = 0
            for (let j = line.length - 1; j >= 0; j--) {
                const metrice = line[j];
                if (metrice.name === 'space' && isEndSpace) {
                    width -= metrice.xAdvance;
                    continue
                } else if (isJustifiedChar(metrice) && isEndSpace) {
                    isEndSpace = false
                    width -= metrice.xAdvance;
                    continue
                } else {
                    isEndSpace = false
                    charactersWidth += metrice.xAdvance;
                    if (isJustifiedChar(metrice)) {
                        wordCount++;
                    }
                }
            }
            if (wordCount > 0) {
                return (width - charactersWidth) / wordCount
            }
        }
    }
    return -1;
}

// 获取当前行最后一个空格下标
export const getLineLastSpaceIdx = (editor: Editor, firstCharacter: number, endCharacter: number) => {
    const textArr = getTextArr(editor)
    const lineText = textArr.slice(firstCharacter, endCharacter).join('')
    for (let i = lineText.length - 1; i >= 0; i--) {
        if (lineText[i] !== ' ') return i;
    }
    return -1;
}

export const isJustifiedChar = (metrice: MetricesInterface) => {
    const len = metrice.codePoints.length === 1
    const code = metrice.codePoints[0]
    const notASCIIChar = !(code > 32 && code <= 126)
    return len && notASCIIChar && metrice.name !== 'isEmoji'
}