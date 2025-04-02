import { EditorInterface } from ".."

export const getFont: EditorInterface['getFont'] = (editor, _family, _style) => {
    const family = _family ?? editor.style.fontName.family
    const style = _style ?? editor.style.fontName.style

    const fonts = editor.fonMgr.get(family)
    if (!fonts) return;

    for (let i = 0; i < fonts?.length; i++) {
        const font = fonts[i];
        let familyName = font?.familyName;
        if ((font as any)?._tables?.name?.records?.preferredFamily?.en) {
            familyName = (font as any)?._tables?.name?.records?.preferredFamily?.en;
        }
        // 优先搜索可变字体
        if ((font as any)?.namedVariations?.[style] && family === familyName) {
            return font.getVariation((font as any).namedVariations?.[style])
        }
        let subfamilyName = font.subfamilyName;
        if ((font as any)?._tables?.name?.records?.preferredSubfamily?.en) {
            subfamilyName = (font as any)?._tables?.name?.records?.preferredSubfamily?.en;
        }
        if (subfamilyName === style) {
            return font;
        }
    }

    return;
}