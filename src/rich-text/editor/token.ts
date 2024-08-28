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
    const tokens: string[] = [];
    let i = 0;
    const asciiPrintable = /[\x20-\x7E]/;

    while (i < input.length) {
        const char = input[i];
        // Rule 1: 连续的、不包含空格的 ASCII 可打印字符是一个词组，比如「I'm」、「constant.」、「word」、「etc...」
        if (asciiPrintable.test(char) && char !== ' ') {
            let start = i;
            while (i < input.length && asciiPrintable.test(input[i]) && input[i] !== ' ') {
                i++;
            }
            tokens.push(input.slice(start, i));
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
const isSymbol = (code: number) => (code >= 33 && code <= 47) || (code >= 58 && code <= 64) || (code >= 91 && code <= 96) || (code >= 123 && code <= 126);
export function wordTokenize(input: string) {
    const tokens: string[] = [];
    let currentPhrase = '';
    let currentType = null;

    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
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
    const token: string[] = []
    for (let i = 0; i < characters?.length; i++) {
        const char = characters[i];
        if (char === '\n') {
            if (str.length) token.push(str)
            str = ''
            token.push(char)
            continue
        }
        if (characterStyleIDs && modifySet.has(characterStyleIDs[i])) {
            if (str.length) token.push(str)
            str = char
            let idx = i
            while (characters[i + 1] && characterStyleIDs[i + 1] === characterStyleIDs[idx] && characters[i + 1] !== '\n') {
                str += characters[i + 1]
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