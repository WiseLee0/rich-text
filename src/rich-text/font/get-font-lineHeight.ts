import { Editor } from ".."

let line_height_key = ''
let line_height_value = 0
export const getFontLineHeight = (editor: Editor, family?: string, fontStyle?: string) => {
    const fontSize = editor.style.fontSize
    const key = `${family ?? editor.style.fontName.family}&${fontStyle ?? editor.style.fontName.style}&${fontSize}`
    if (line_height_key === key) return line_height_value
    let font = editor.getFont(family, fontStyle);
    if (!font) return 0;
    let unitsPerPx = fontSize / (font.unitsPerEm || 1000);
    const ascent = font.ascent * unitsPerPx
    const decent = font.descent * unitsPerPx
    const lineGap = font.lineGap * unitsPerPx
    line_height_key = key
    line_height_value = ascent - decent + lineGap
    return line_height_value
}