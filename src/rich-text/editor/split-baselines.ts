import { Editor, getCodePoints, getLineIndentationLevelPixels, lineTokenize, MetricesInterface } from "..";

// Rule1: 空白词组遇到段行会放置在当前行末尾，即使它已经超出元素外
// Rule2: 尽可能不切断词组，让其完整在一行展示，除非当前词组的宽度大于文本元素的宽度
// Rule3: 连续的、不包含空格的 ASCII 可打印字符是一个词组，比如「I'm」、「constant.」、「word」、「etc...」
// Rule4: 剩余未明确定义的字符，单个字符就算作是一个词组
export const splitBaseLines = (editor: Editor, maxWidth: number) => {
    const lines: MetricesInterface[][] = [];
    const words = splitWordGroup(editor);
    if (!words) return;
    return wordGroupLines(editor, lines, words, maxWidth)
}
// 处理空格，空格切回到上一行，没有的话创建新行
const spaceLine = (metrice: MetricesInterface, lines: MetricesInterface[][]) => {
    const words = lines?.[lines.length - 1];
    const word = words?.[words?.length - 1];
    if (lines.length - 1 >= 0 && word.name !== '\n') {
        lines[lines.length - 1].push(metrice)
    } else {
        let currentLine: MetricesInterface[] = [];
        currentLine.push(metrice)
        lines.push(currentLine)
    }
}
// 对词组进行分行
const wordGroupLines = (editor: Editor, lines: MetricesInterface[][], _wordGroup: MetricesInterface[][], textMaxWidth: number) => {
    let currentLine: MetricesInterface[] = [];
    let currentWidth = 0
    let maxWidth = textMaxWidth
    const textDataLines = editor.textData.lines
    if (!textDataLines?.length) {
        console.warn('wordGroupLines exception')
        return
    }
    const wordGroup = [..._wordGroup]

    if (editor.style.paragraphIndent > 0) {
        const xAdvance = Math.min(editor.style.paragraphIndent, maxWidth)
        for (let i = 0; i < wordGroup.length; i++) {
            const word = wordGroup[i];
            if (i === 0 || isWrap(wordGroup[i - 1])) {
                word.unshift({
                    ...word[0],
                    name: 'paragraphIndent',
                    codePoints: [-1],
                    xAdvance
                })
            }
        }
    }

    for (let i = 0; i < wordGroup.length; i++) {
        const word = wordGroup[i]
        const wordWidth = word.reduce((pre, cur) => pre + cur.xAdvance, 0)

        const isSpace = word.length === 1 && word[0].name === 'space'

        // 处理缩进层级
        maxWidth = textMaxWidth - getLineIndentationLevelPixels(editor, word[0].firstCharacter)
        maxWidth += word[word.length - 1].letterSpacing

        // 换行符
        if (isWrap(word)) {
            const wrapWord = word[0].name === '\n' ? word[0] : word[1]
            // 如果上一行已经存在换行符，则需要新开一行
            if (lines.length && lines[lines.length - 1]) {
                const preLine = lines[lines.length - 1]
                if (!currentLine.length && preLine[preLine.length - 1].name === '\n') {
                    lines.push([wrapWord]);
                    currentLine = []
                    currentWidth = 0
                    continue
                }
            }
            // 如果上一行不存在换行符，则拼接到上一行
            if (currentLine.length) {
                currentLine.push(wrapWord)
                lines.push(currentLine);
            } else if (lines.length) {
                currentLine = lines.pop()!
                currentLine.push(wrapWord)
                lines.push(currentLine);
            } else {
                lines.push([wrapWord]);
            }
            currentLine = []
            currentWidth = 0
            continue
        }

        // 只有一个词组，并且比最大宽度大
        if (wordWidth > maxWidth && !isSpace) {
            if (currentLine.length) lines.push(currentLine);
            const wordRes = wordLines(lines, word, maxWidth)
            currentLine = wordRes.currentLine
            currentWidth = wordRes.currentWidth
            continue
        }
        // 处理空格
        if (isSpace) {
            const hasCurrentLine = currentLine.length
            if (hasCurrentLine) lines.push(currentLine);
            spaceLine(word[0], lines)
            currentLine = lines.pop()!;
            currentWidth += wordWidth;
            continue
        }
        if (currentWidth + wordWidth > maxWidth) {
            if (currentLine.length) lines.push(currentLine);
            currentLine = [];
            currentWidth = 0;
            const wordRes = wordLines(lines, word, maxWidth)
            currentLine = wordRes.currentLine
            currentWidth = wordRes.currentWidth
            continue
        }
        currentLine.push(...word);
        currentWidth += wordWidth;
    }
    if (currentLine.length) lines.push(currentLine);

    if (editor.style.paragraphIndent > 0) {
        const newLine = []
        for (let i = 0; i < lines.length; i++) {
            const temp = []
            for (let j = 0; j < lines[i].length; j++) {
                const item = lines[i][j];
                if (item.name === 'paragraphIndent') continue
                temp.push(item)
            }
            if (temp.length) newLine.push(temp)
        }
        lines = newLine
    }
    return lines
}
// 对单词进行分行
const wordLines = (lines: MetricesInterface[][], metrices: MetricesInterface[], maxWidth: number) => {
    const mLen = metrices.length
    let currentLine: MetricesInterface[] = [];
    let currentWidth = 0

    for (let i = 0; i < mLen; i++) {
        const metrice = metrices[i];
        const width = metrice.xAdvance

        // 只有一个字符，并且比最大宽度大
        if (width > maxWidth && metrice.name !== 'space') {
            if (currentLine.length) lines.push(currentLine);
            lines.push([metrice]);
            currentLine = [];
            currentWidth = 0;
            continue
        }

        // 处理空格，空格切回到上一行，没有的话创建新行
        if (metrice.name === 'space') {
            if (currentLine.length) lines.push(currentLine);
            spaceLine(metrice, lines)
            currentLine = lines.pop()!;
            currentWidth += width;
            continue
        }

        if (currentWidth + width > maxWidth) {
            if (currentLine.length) lines.push(currentLine);
            currentLine = [];
            currentWidth = 0;
        }
        currentLine.push(metrice);
        currentWidth += width;
    }
    return {
        currentLine,
        currentWidth
    }
}

const splitWordGroup = (editor: Editor) => {
    const metrices = editor.getMetrices()
    if (!metrices) return;

    const text = editor.getText()
    const wordLens = lineTokenize(text).map(item => getCodePoints(item).length)
    const words: MetricesInterface[][] = []
    let mIdx = 0
    for (let i = 0; i < wordLens.length; i++) {
        let len = wordLens[i];
        const temp: MetricesInterface[] = []
        while (len > 0) {
            const metrice = metrices[mIdx++];
            if (!metrice) break;
            len -= metrice.codePoints.length
            temp.push(metrice)
        }
        if (temp.length) words.push(temp)
    }
    return words
}

const isWrap = (word: MetricesInterface[]) => {
    if (word.length === 1) return word[0].name === '\n'
    if (word.length === 2) return word[0].name === 'paragraphIndent' && word[1].name === '\n'
    return false
}