import FontMgr from "./fontMgr";
import type { MetricesInfo } from "./type";

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
        // Rule 2: 单个空格或连续的多个空格算作一个词组
        else if (char === ' ') {
            let start = i;
            while (i < input.length && input[i] === ' ') {
                i++;
            }
            tokens.push(input.slice(start, i));
        }
        // Rule 3: 剩余未明确定义的字符，单个字符就算作是一个词组
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
export function familyTokenize(textData: Record<string, any>) {
    const { characterStyleIDs, styleOverrideTable, characters } = textData
    const familyModifySet = new Set<number>()
    for (let i = 0; i < styleOverrideTable?.length; i++) {
        const styleOverride = styleOverrideTable[i];
        if (styleOverride?.fontName?.family) {
            familyModifySet.add(styleOverride.styleID)
        }
    }

    let str = ''
    const token: string[] = []
    for (let i = 0; i < characters?.length; i++) {
        const char = characters[i];
        if (characterStyleIDs && familyModifySet.has(characterStyleIDs[i])) {
            if (str.length) token.push(str)
            str = char
            let idx = i
            while (characterStyleIDs[i + 1] === characterStyleIDs[idx]) {
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

/**
 * 获取字符的度量信息
 */
export const getMetrices = (data: Record<string, any>, familyTokens: string[]) => {
    const { characterStyleIDs, styleOverrideTable } = data.textData

    const styleMap = new Map<number, any>()
    for (let i = 0; i < styleOverrideTable?.length; i++) {
        const styleOverride = styleOverrideTable[i];
        styleMap.set(styleOverride.styleID, styleOverride)
    }

    const xAdvances: number[] = []
    const advanceWidths: number[] = []
    const advanceHeights: number[] = []
    const ascents: number[] = []
    const fontSizes: number[] = []
    const paths: string[] = []
    let offset = 0
    for (let i = 0; i < familyTokens.length; i++) {
        const token = familyTokens[i];
        const style = styleMap.get(characterStyleIDs?.[offset])
        let family = style?.fontName?.family ?? data.fontName.family
        const font = FontMgr.getFont(family)
        if (!font) continue
        const { glyphs, positions } = font.layout(token)

        for (let i = 0; i < glyphs.length; i++) {
            const style = styleMap.get(characterStyleIDs?.[offset + i])
            const fontSize = style?.fontSize ?? data.fontSize
            let unitsPerPx = fontSize / (font.unitsPerEm || 1000);
            xAdvances.push(positions[i].xAdvance * unitsPerPx)
            advanceHeights.push((glyphs[i] as any).advanceHeight * unitsPerPx)
            ascents.push(font.ascent * unitsPerPx)
            advanceWidths.push(glyphs[i].advanceWidth * unitsPerPx)
            fontSizes.push(fontSize)
            paths.push(glyphs[i].path.scale(unitsPerPx, -unitsPerPx).toSVG())
        }
        offset += token.length
    }

    return {
        xAdvances,
        advanceHeights,
        advanceWidths,
        ascents,
        fontSizes,
        paths
    } as MetricesInfo;
}

// 根据给定的字符宽度列表和固定宽度，将字符分行，每行的总宽度不超过固定宽度
export const splitLines = (wList: number[], maxWidth: number) => {
    const lines = [];
    let currentLine = [];
    let currentWidth = 0;

    for (let width of wList) {
        if (currentWidth + width > maxWidth) {
            if (currentLine.length) lines.push(currentLine);
            currentLine = [];
            currentWidth = 0;
        }
        currentLine.push(width);
        currentWidth += width;
    }
    if (currentLine.length) lines.push(currentLine);
    return lines;
}

// 返回数组中与 target 最接近的元素的下标
export function findClosestIndex(nums: number[], target: number) {
    if (nums.length === 0) {
        return -1; // 如果数组为空，返回 -1 表示无效下标
    }

    let closestIndex = 0;
    let closestDifference = Math.abs(nums[0] - target);

    for (let i = 1; i < nums.length; i++) {
        const currentDifference = Math.abs(nums[i] - target);
        if (currentDifference < closestDifference) {
            closestDifference = currentDifference;
            closestIndex = i;
        }
    }

    return closestIndex;
}