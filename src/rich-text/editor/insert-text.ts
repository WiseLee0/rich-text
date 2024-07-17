import { EditorInterface } from "..";

export const insertText: EditorInterface['insertText'] = (editor, text) => {
    let range = editor.getAnchorAndFocusOffset()
    if (!range) {
        editor.selection = {
            anchor: [0, 0],
            focus: [0, 0]
        }
        range = {
            anchorOffset: 0,
            focusOffset: 0
        }
    }
    if (editor.isCollapse()) {
        const idx = range.anchorOffset
        const characters = editor.textData.characters
        const newText = characters.slice(0, idx) + text + characters.slice(idx)
        editor.textData.characters = newText
        editor.clearCache()
        editor.apply()
        editor.translateSelection(text.length)
    }
}