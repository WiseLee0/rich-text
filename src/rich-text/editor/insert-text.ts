import { EditorInterface, wrapSelection } from "..";

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
        const newText = characters.substring(0, idx) + text + characters.substring(idx)
        editor.textData.characters = newText
        editor.clearCache()
        editor.apply()
        if (text === '\n') {
            wrapSelection(editor, 1)
            return;
        }
        editor.setSelectionOffset(idx + text.length)
    }
}