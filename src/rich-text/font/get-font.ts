import { EditorInterface } from ".."

const AxisTable = {
    'Width': 'wdth',
    'Weight': 'wght',
} as Record<string, string>

export const getFont: EditorInterface['getFont'] = (editor, family, style) => {
    const fonts = editor.fonMgr.get(family ?? '')
    if (!fonts) return;

    for (let i = 0; i < fonts?.length; i++) {
        const font = fonts[i];
        // 优先搜索可变字体
        let variation = (font as any).namedVariations[style ?? '']
        if (variation && editor.style.fontVariations.length && family === editor.style.fontName?.family) {
            variation = {}
            editor.style.fontVariations.map(item => {
                const key = AxisTable[item.axisName]
                if (key) {
                    variation[key] = item.value
                }
            })
        }
        if (variation) {
            return font.getVariation(variation)
        }
        if (font.subfamilyName === style) {
            return font;
        }
    }

    return;
}