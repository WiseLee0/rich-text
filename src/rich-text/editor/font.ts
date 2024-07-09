import { EditorInterface } from "../interfaces/editor";
import * as fontkit from 'fontkit'
import type { FontCollection, Font } from "fontkit";

export const fontMgrFromData: EditorInterface['fontMgrFromData'] = (editor, buffers) => {
    if (!buffers) return;
    for (let i = 0; i < buffers.length; i++) {
        const buffer = buffers[i];
        // fontkit类型错误，这里设置Any类型
        const font = fontkit.create(new Uint8Array(buffer) as any)
        if (Array.isArray(font)) {
            editor.fonMgr.collections.push(font as FontCollection)
        } else {
            editor.fonMgr.fonts.push(font as Font)
        }
    }
}

export const getFont: EditorInterface['getFont'] = (editor, family) => {
    const item = editor.fonMgr.fonts.find(item => item.familyName === family)
    if (item) return item;
    for (let i = 0; i < editor.fonMgr.collections.length; i++) {
        const collections = editor.fonMgr.collections[i];
        for (let j = 0; j < collections.fonts.length; j++) {
            const font = collections.fonts[j];
            if (font.familyName === family) {
                return font;
            }
        }
    }
    
}