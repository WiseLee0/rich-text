import * as fontkit from 'fontkit'
import type { FontCollection, Font } from "fontkit";
import { addFontMeta, Editor, EditorInterface, opfs } from '..';
import InterSub from './inter-sub.ttf'

const addFont = (editor: Editor, font: Font) => {
    const { fonMgr } = editor
    const familyName = font.familyName
    if (!familyName) {
        console.warn('addFont exception')
        return
    }
    const fontInfo = fonMgr.get(familyName)
    if (fontInfo) {
        const hasFont = fontInfo.find(item => item.subfamilyName === font.subfamilyName)
        if (hasFont) return;
        fontInfo.push(font)
        fonMgr.set(familyName, fontInfo)
    } else {
        fonMgr.set(familyName, [font])
    }
}

export const fontMgrFromData: EditorInterface['fontMgrFromData'] = (editor, buffers) => {
    if (!buffers) return;
    for (let i = 0; i < buffers.length; i++) {
        const buffer = buffers[i];
        // fontkit类型错误，这里设置Any类型
        const font = fontkit.create(new Uint8Array(buffer) as any)
        if (Array.isArray(font)) {
            const fontCollection = font as FontCollection
            for (let j = 0; j < fontCollection.fonts.length; j++) {
                addFont(editor, fontCollection.fonts[j])
            }
        } else {
            addFont(editor, font as Font)
        }
    }
}

export const fontMgrFromURL: EditorInterface['fontMgrFromURL'] = async (editor, fontName, url) => {
    const key = `${fontName.family}#${fontName.style}#${fontName.postscript}`
    const data = await opfs.read(key, url);
    if (data.byteLength) {
        addFontMeta(editor, fontName, url)
        fontMgrFromData(editor, [data]);
    }
};

const DefaultFontGlyphs = '•.0123456789abcdefghijklmnopqrstuvwxyz'
export const loadDefaultFont = async (editor: Editor) => {
    const data = await opfs.read('__default_font', InterSub);
    const font = fontkit.create(new Uint8Array(data) as any) as fontkit.Font
    editor.fonMgr.set('__default', [font])
}
export const getDefaultFontIdx = (char: string) => {
    const result = DefaultFontGlyphs.indexOf(char)
    return result > -1 ? result + 1 : -1
}