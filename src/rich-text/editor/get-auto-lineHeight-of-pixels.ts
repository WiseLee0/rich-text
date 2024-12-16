import { Editor, EditorInterface } from "..";

export const getAutoLineHeightOfPixels: EditorInterface['getAutoLineHeightOfPixels'] = (editor) => {
    const metrices = editor.getMetrices()
    const { characterStyleIDs, styleOverrideTable } = editor.textData
    if (!metrices?.length || !characterStyleIDs?.length || !styleOverrideTable?.length) {
        return getEditorLineHeight(editor)
    }

    const offset = editor.getSelectCharacterOffset()
    if (!offset) return 0;
    let sliceIds: number[] = []
    if (offset.anchor === offset.focus) {
        if (offset.anchor !== 0) {
            sliceIds = characterStyleIDs?.slice(offset.anchor - 1, offset.focus);
        }
    } else {
        sliceIds = characterStyleIDs?.slice(offset.anchor, offset.focus);
    }
    const idSet = new Set(sliceIds);

    let pixels = -1
    if (idSet.has(0)) {
        pixels = getEditorLineHeight(editor)
        idSet.delete(0)
    }

    for (let i = 0; i < styleOverrideTable.length; i++) {
        const override = styleOverrideTable[i];
        if (!idSet.has(override.styleID)) continue;
        if (override?.lineHeight?.units && override?.lineHeight?.units !== "PERCENT") {
            return 'mix'
        }
        const family = override?.fontName?.family;
        const style = override?.fontName?.style;
        const font = editor.getFont(family, style);
        if (!font) return 0;
        const fontSize = editor.style.fontSize;
        let unitsPerPx = fontSize / (font.unitsPerEm || 1000);
        const curPixels = Math.round((font.ascent - font.descent) * unitsPerPx)
        if (pixels === -1) {
            pixels = curPixels
        }
        if (pixels !== curPixels) {
            return 'mix'
        }
    }

    return pixels;
}

// 获取全局的行高
const getEditorLineHeight = (editor: Editor) => {
    const font = editor.getFont();
    if (!font) return 0;
    const fontSize = editor.style.fontSize;
    let unitsPerPx = fontSize / (font.unitsPerEm || 1000);
    return Math.round((font.ascent - font.descent) * unitsPerPx)
}