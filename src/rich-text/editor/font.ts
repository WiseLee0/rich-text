import { EditorInterface } from "..";
import * as fontkit from 'fontkit'
import type { FontCollection, Font } from "fontkit";

export const fontMgrFromData: EditorInterface['fontMgrFromData'] = (editor, buffers) => {
    if (!buffers) return;
    const { fonMgr } = editor
    for (let i = 0; i < buffers.length; i++) {
        const buffer = buffers[i];
        // fontkit类型错误，这里设置Any类型
        const font = fontkit.create(new Uint8Array(buffer) as any)
        if (Array.isArray(font)) {
            const fontCollection = font as FontCollection
            for (let j = 0; j < fontCollection.fonts.length; j++) {
                const _font = fontCollection.fonts[j];
                const familyName = _font.familyName
                const fontInfo = fonMgr.get(familyName)
                if (fontInfo) {
                    fontInfo.push(_font)
                    fonMgr.set(familyName, fontInfo)
                } else {
                    fonMgr.set(familyName, [_font])
                }
            }
        } else {
            const _font = font as Font
            const familyName = _font.familyName
            const fontInfo = fonMgr.get(familyName)
            if (fontInfo) {
                fontInfo.push(_font)
                fonMgr.set(familyName, fontInfo)
            } else {
                fonMgr.set(familyName, [_font])
            }
        }
    }
}

export const getFonts: EditorInterface['getFonts'] = (editor, family) => {
    return editor.fonMgr.get(family ?? '')
}

export const getFont: EditorInterface['getFont'] = (editor, family, style) => {
    const fonts = editor.fonMgr.get(family ?? '')
    return fonts?.find(item => item.subfamilyName === style)
}
