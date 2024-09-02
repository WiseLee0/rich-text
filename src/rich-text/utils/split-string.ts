import { getCodePoints, getCompositeEmoji } from '..';

export function splitString(str: string) {
    // 有兼容问题就换这个 => https://github.com/flmnt/graphemer/tree/master
    const _charArr = Array.from(new Intl.Segmenter().segment(str)).map(x => x.segment)
    const charArr: string[] = []
    const codePoints: number[][] = []

    for (let i = 0; i < _charArr.length; i++) {
        let char = _charArr[i];
        if (char.length) {
            const points = getCodePoints(char)
            // 复合emoji有些错误，不再拼合，全拆出来
            if (points.length > 1) {
                const [isCompositeEmoji, compositeEmojiArr, compositeEmojiIdxArr] = getCompositeEmoji(char)
                if (!isCompositeEmoji) {
                    for (let j = 0; j < char.length; j++) {
                        const idx = compositeEmojiIdxArr.indexOf(j)
                        if (idx > -1) {
                            const emojiItem = compositeEmojiArr[idx];
                            charArr.push(emojiItem)
                            codePoints.push(getCodePoints(emojiItem))
                            j += emojiItem.length - 1
                            continue
                        }
                        charArr.push(char[j])
                        codePoints.push(getCodePoints(char[j]))
                    }
                    continue
                }
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
