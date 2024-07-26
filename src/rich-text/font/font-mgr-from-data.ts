import * as fontkit from 'fontkit'
import type { FontCollection, Font } from "fontkit";
import { Editor, EditorInterface } from '..';

const addFont = (editor: Editor, font: Font) => {
    const { fonMgr } = editor
    const familyName = font.familyName
    const fontInfo = fonMgr.get(familyName)
    if (fontInfo) {
        const hasFont = fontInfo.find(item => item.constructor.name === font.constructor.name)
        if (hasFont) return;
        fontInfo.push(font)
        fonMgr.set(familyName, fontInfo)
    } else {
        fonMgr.set(familyName, [font])
    }
}

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
                addFont(editor, fontCollection.fonts[j])
            }
        } else {
            addFont(editor, font as Font)
        }
    }
}
