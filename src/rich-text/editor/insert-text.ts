import { EditorInterface } from "..";

export const insertText: EditorInterface['insertText'] = (editor, text) => {
    const range = editor.getAnchorAndFocusOffset()
    if (!range) return
    if (editor.isCollapse()) {
        const idx = range.anchorOffset
        const characters = editor.textData.characters
        const newText = characters.slice(0, idx) + text + characters.slice(idx)
        editor.textData.characters = newText
        editor.selectForOffset(idx + text.length)
    }
}