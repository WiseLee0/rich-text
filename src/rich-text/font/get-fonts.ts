import { EditorInterface } from ".."

export const getFonts: EditorInterface['getFonts'] = (editor, family) => {
    return editor.fonMgr.get(family ?? editor.style.fontName.family)
}