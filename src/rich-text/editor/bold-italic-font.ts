import { Editor, EditorInterface, findConsecutiveRanges, Font, FontItem, getTextArr } from "..";

export const boldFont: EditorInterface['boldFont'] = (editor, fontMap) => {
    return setBoldItalicFont(editor, 'bold', fontMap)
}

export const italicFont: EditorInterface['italicFont'] = (editor, fontMap) => {
    return setBoldItalicFont(editor, 'italic', fontMap)
}

const setBoldItalicFont = (editor: Editor, type: 'bold' | 'italic', fontMap: Map<string, FontItem[]>) => {
    const characterOffset = editor.getSelectCharacterOffset();
    const anchor = characterOffset?.anchor ?? 0
    const focus = characterOffset?.focus ?? getTextArr(editor).length
    const ids = []
    for (let i = anchor; i < focus; i++) {
        const id = editor.textData?.characterStyleIDs?.[i];
        ids.push(id ?? 0)
    }
    const ranges = findConsecutiveRanges(ids);
    if (!ranges?.length) return;
    const preStyle = editor.getStyleForSelection()?.fontName?.style;
    // 是否需要进行操作
    const nextShouldOperate = preStyle === 'mix' || !preStyle?.toLocaleLowerCase()?.includes(type);

    const loadMetaFontItems: FontItem[] = []

    for (const range of ranges) {
        const start = anchor + range[0];
        const end = anchor + range[1] + 1;
        editor.selectForCharacterOffset(start, end);
        const fontName = editor.getStyleForSelection().fontName;
        if (fontName.family === 'mix' || fontName.style === 'mix') continue;
        const fonts = editor.getFonts(fontName.family);
        if (!fonts?.length) continue;
        const fontItems = fontMap.get(fontName.family);
        const subfamilyName = searchSubfamilyName(fonts, nextShouldOperate ? type : 'regular', fontItems);
        if (!subfamilyName) continue;
        const newFontName = {
            ...fontName,
            style: subfamilyName
        }
        const font = editor.getFont(newFontName.family, newFontName.style);
        if (font) {
            editor.setStyle({
                fontName: newFontName
            })
            continue;
        }
        // eidtor是单例，异步会中断数据
        const fontItem = fontItems?.find(item => item.subfamilyName === subfamilyName);
        if (fontItem?.assetUrl) {
            loadMetaFontItems.push(fontItem)
        }
    }
    if (characterOffset) {
        editor.selectForCharacterOffset(characterOffset.anchor, characterOffset.focus);
    }
    return loadMetaFontItems;
}

export const searchSubfamilyName = (fonts: Font[], type: 'bold' | 'regular' | 'italic', fontItems?: FontItem[]) => {
    for (let i = 0; i < fonts?.length; i++) {
        const font = fonts[i];
        // 优先搜索可变字体
        if ((font as any)?.namedVariations) {
            const namedVariations = (font as any)?.namedVariations;
            for (const style in namedVariations) {
                const styleName = style.toLocaleLowerCase();
                if (type === 'bold' && styleName === 'bold') {
                    return style;
                }
                if (type === 'regular' && styleName === 'regular') {
                    return style;
                }
                if (type === 'italic' && styleName === 'italic') {
                    return style;
                }
            }
        }
        let subfamilyName = font.subfamilyName;
        if ((font as any)?._tables?.name?.records?.preferredSubfamily?.en) {
            subfamilyName = (font as any)?._tables?.name?.records?.preferredSubfamily?.en;
        }
        if (type === 'bold' && subfamilyName === 'bold') {
            return subfamilyName;
        }
        if (type === 'regular' && subfamilyName === 'regular') {
            return subfamilyName;
        }
        if (type === 'italic' && subfamilyName === 'italic') {
            return subfamilyName;
        }
    }
    // 搜索字体库
    if (fontItems?.length) {
        for (const fontItem of fontItems) {
            if (fontItem.subfamilyName.toLocaleLowerCase() === type) {
                return fontItem.subfamilyName;
            }
        }
    }
}
