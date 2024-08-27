import { EditorInterface } from ".."

export const getFont: EditorInterface['getFont'] = (editor, _family, _style) => {
    const family = _family ?? editor.style.fontName.family
    const style = _style ?? editor.style.fontName.style

    const fonts = editor.fonMgr.get(family)
    if (!fonts) return;

    for (let i = 0; i < fonts?.length; i++) {
        const font = fonts[i];
        // 优先搜索可变字体
        if ((font as any)?.namedVariations?.[style] && family === font?.familyName) {
            return font.getVariation((font as any).namedVariations?.[style])
        }

        if (font.subfamilyName === style) {
            return font;
        }
    }

    return;
}