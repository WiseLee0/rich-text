import { Font } from ".."

export const checkFontSupport = (font: Font, codePoints: number[]) => {
    for (let i = 0; i < codePoints.length; i++) {
        if (!font.hasGlyphForCodePoint(codePoints[i])) {
            return false
        }
    }
    return true
}