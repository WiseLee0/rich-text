export const getCodePoints = (char: string) => {
    const codePoints: number[] = [];
    for (let i = 0; i < char.length; i++) {
        const codePoint = char.codePointAt(i);
        if (codePoint === undefined) continue
        codePoints.push(codePoint);
        // 如果是代理对的一部分，跳过下一个单元
        if (codePoint > 0xffff) {
            i++;
        }
    }
    return codePoints;
}