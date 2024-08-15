import { EditorInterface } from ".."

export const getLineHeightOfPixels: EditorInterface['getLineHeightOfPixels'] = (editor, firstCharacter) => {
    const style = editor.getStyle(firstCharacter)
    if (style.lineHeight.units === 'PERCENT') {
        return Math.round(style.fontSize * (style.lineHeight.value / 100) * 1.157)
    }
    return style.lineHeight.value
}