import { detectEmoji, splitString } from "..";
/**
 * 将字符列表分割为换行词组
 *
 * 词组分割规则如下
 * 1. 连续的、不包含空格的 ASCII 可打印字符是一个词组，比如「I'm」、「constant.」、「word」、「etc...」
 * 2. 单个空格或连续的多个空格算作一个词组（此处的空格指 ASCII 中定义的空格字符：0x20）
 * 3. 剩余未明确定义的字符，单个字符就算作是一个词组
 *
 */
export function lineTokenize(input: string) {
    const { charArr } = splitString(input)
    const tokens: string[] = [];
    let i = 0;
    const asciiPrintable = /[\x20-\x7E]/;

    while (i < charArr.length) {
        const char = charArr[i];
        // Rule 1: 连续的、不包含空格的 ASCII 可打印字符是一个词组，比如「I'm」、「constant.」、「word」、「etc...」
        if (asciiPrintable.test(char) && char !== ' ') {
            let start = i;
            while (i < charArr.length && asciiPrintable.test(charArr[i]) && charArr[i] !== ' ') {
                i++;
            }
            tokens.push(charArr.slice(start, i).join(''));
        }
        // Rule 2: 剩余未明确定义的字符，单个字符就算作是一个词组
        else {
            tokens.push(char);
            i++;
        }
    }

    return tokens;
}

/**
 * 将字符列表分割为选区词组
 *
 * 词组分割规则如下
 * 1. 单个空格或连续的多个空格算作一个词组（此处的空格指 ASCII 中定义的空格字符：0x20）
 * 2. 连续的、不包含空格的符号类型 ASCII 可打印字符是一个词组，比如「@#$^&!」、「+-)(=#」
 * 3. 剩余连续的、不包含字符和空格类型字符是一个词组，比如「Im」、「constant你好」
 *
 */
// 常见的中文标点符号（这里只列举了一部分，可以根据需要添加更多）
const isChineseSymbol = (code: number) => (
    code === 65288   // （
    || code === 65289   // ）
    || code === 65292   // ，
    || code === 65306   // ：
    || code === 65307   // ；
    || code === 65311   // ？
    || code === 8220    // “
    || code === 8221    // ”
    || code === 8216    // ‘
    || code === 8217    // ’
    || code === 8230    // ……
    || code === 12289   // 、
    || code === 12290   // 。
    || code === 12298   // 《
    || code === 12299   // 》
    || code === 12299   // 》
    || code === 12300   // 「
    || code === 12301   // 」
    || code === 12304   // 【
    || code === 12305   // 】
    || code === 8212    // ——
    || code === 65281   // ！
    // 添加其他需要的中文符号的 Unicode 编码
);
const isSymbol = (code: number) => (code >= 33 && code <= 47) || (code >= 58 && code <= 64) || (code >= 91 && code <= 96) || (code >= 123 && code <= 126) || isChineseSymbol(code);
export function wordTokenize(input: string) {
    const tokens: string[] = [];
    let currentPhrase = '';
    let currentType = null;

    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === '\n') continue;
        let newType;

        if (ch === ' ') {
            newType = 'space';
        } else if (isSymbol(ch.charCodeAt(0))) {
            newType = 'symbol';
        } else {
            newType = 'word';
        }

        if (newType !== currentType && currentPhrase !== '') {
            tokens.push(currentPhrase);
            currentPhrase = '';
        }

        currentType = newType;
        currentPhrase += ch;
    }

    if (currentPhrase !== '') {
        tokens.push(currentPhrase);
    }

    return tokens;
}

/**
 * 将字符串按照字体进行分割
 */
export function fontTokenize(textData: Record<string, any>, characters: string) {
    const { characterStyleIDs, styleOverrideTable } = textData
    const modifySet = new Set<number>()
    for (let i = 0; i < styleOverrideTable?.length; i++) {
        const styleOverride = styleOverrideTable[i];
        if (styleOverride.fontLigatures === "DISABLE") {
            modifySet.add(styleOverride.styleID)
        }
        if (styleOverride.fontPosition !== "NONE") {
            modifySet.add(styleOverride.styleID)
        }
        if (styleOverride.fontNumericFraction === "ENABLE") {
            modifySet.add(styleOverride.styleID)
        }
        if (styleOverride?.fontName?.family) {
            modifySet.add(styleOverride.styleID)
        }
    }

    let str = ''
    let characterOffset = -1
    const token: string[] = []
    const { charArr, codePoints } = splitString(characters)

    for (let i = 0; i < charArr?.length; i++) {
        const char = charArr[i];
        characterOffset += codePoints[i].length
        if (char === '\n' || detectEmoji(char)) {
            if (str.length) token.push(str)
            str = ''
            token.push(char)
            continue
        }
        // 零宽连接符不可以单独存在
        const code = char.codePointAt(0)
        if (code && (code === 8205 || code === 65039)) {
            if (str.length) token.push(str)
            str = ''
            token.push(char)
            continue
        }

        if (characterStyleIDs && modifySet.has(characterStyleIDs[characterOffset])) {
            if (str.length) token.push(str)
            str = char
            while (charArr[i + 1] && characterStyleIDs[characterOffset + 1] === characterStyleIDs[characterOffset] && charArr[i + 1] !== '\n') {
                str += charArr[i + 1]
                characterOffset += codePoints[i + 1].length
                i++
            }
            token.push(str)
            str = ''
            continue
        }
        str += char
    }
    if (str.length) token.push(str)
    return token
}