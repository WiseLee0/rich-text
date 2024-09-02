/**
 * Rule1: 仅在宽度固定下生效
 * Rule2: 一行文本宽度 < 固定宽度，自动换行
 * Rule3: 词组之间必须存在空格
 * Rule4: 换行的最后一行即是存在空格，也不会生效
*/

import { Editor, getTextArr, MetricesInterface } from "..";

// [两端对齐] 计算基线宽度
export const calcJustifiedBaseLineWidth = (editor: Editor, lines: MetricesInterface[][], i: number, firstCharacter: number, endCharacter: number) => {
    const textArr = getTextArr(editor)
    const { textAlignHorizontal, textAutoResize } = editor.style
    if (textAlignHorizontal === 'JUSTIFIED') {
        const line = lines[i]
        const haveWrap = line[line.length - 1].name === '\n';
        if (textAutoResize !== 'WIDTH_AND_HEIGHT' && !haveWrap && i < lines.length - 1) {
            const lineText = textArr.slice(firstCharacter, endCharacter).join('')
            const hasSpace = /\x20[^\x20]/.test(lineText) // 词组之间必须存在空格
            if (hasSpace) {
                let lineWidth = editor.width
                for (let j = line.length - 1; j >= 0; j--) {
                    const metrice = line[j];
                    if (metrice.name === 'space') lineWidth += metrice.xAdvance
                    else break;
                }
                return lineWidth
            }
        }
    }
    return -1
}

// [两端对齐] 计算空格宽度
export const calcJustifiedSpaceWidth = (editor: Editor, line: MetricesInterface[], firstCharacter: number, endCharacter: number) => {
    const { textAlignHorizontal, textAutoResize } = editor.style
    if (textAlignHorizontal === 'JUSTIFIED') {
        const textArr = getTextArr(editor)
        const haveWrap = line[line.length - 1].name === '\n';
        if (textAutoResize !== 'WIDTH_AND_HEIGHT' && !haveWrap) {
            const lineText = textArr.slice(firstCharacter, endCharacter).join('')
            const hasSpace = /\x20[^\x20]/.test(lineText) // 词组之间必须存在空格
            if (hasSpace) {
                let spaceCount = 0
                let isEndSpace = true
                for (let j = line.length - 1; j >= 0; j--) {
                    const metrice = line[j];
                    if (metrice.name === 'space' && isEndSpace) continue
                    else {
                        isEndSpace = false
                        if (metrice.name === 'space') spaceCount++;
                    }
                }
                if (spaceCount > 0) {
                    const charactersWidth = line.reduce((pre, cur) => {
                        if (cur.name === 'space') return pre
                        return pre + cur.xAdvance
                    }, 0)
                    return (editor.width - charactersWidth) / spaceCount
                }
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