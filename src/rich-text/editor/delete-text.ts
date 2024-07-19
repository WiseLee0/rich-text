import { EditorInterface, wrapSelection } from "..";

export const deleteText: EditorInterface['deleteText'] = (editor, distance = 1) => {
    const range = editor.getAnchorAndFocusOffset()
    if (!range) return
    if (editor.isCollapse()) {
        const idx = range.anchorOffset
        const characters = editor.textData.characters
        let newText = characters.substring(0, idx - distance) + characters.substring(idx)
        if (newText === '\n') newText = ''
        editor.textData.characters = newText
        editor.clearCache()
        editor.apply()

        if (idx === characters.length && characters[characters.length - 1] === '\n') {
            wrapSelection(editor, -1)
            return;
        }
        editor.setSelectionOffset(idx - distance)
    }
}