import { getCodePoints, isCompositeEmoji } from '..';

export function splitString(str: string) {
    // 完美解决“👨‍👨‍👧‍👧”和“👦🏾”的问题，有兼容问题就换这个 => https://github.com/flmnt/graphemer/tree/master
    const _charArr = Array.from(new Intl.Segmenter().segment(str)).map(x => x.segment)
    const charArr: string[] = []
    const codePoints: number[][] = []

    for (let i = 0; i < _charArr.length; i++) {
        let char = _charArr[i];
        if (char.length) {
            const points = getCodePoints(char)
            // 复合emoji有些错误，不再拼合，全拆出来
            if (points.length > 1 && !isCompositeEmoji(char)) {
                const emojiArr = Array.from(char)
                for (let j = 0; j < emojiArr.length; j++) {
                    const emojiItem = emojiArr[j];
                    charArr.push(emojiItem)
                    codePoints.push(getCodePoints(emojiItem))
                }
                continue
            }
            charArr.push(char)
            codePoints.push(points)
        }
    }

    return {
        charArr,
        codePoints,
    }
}
