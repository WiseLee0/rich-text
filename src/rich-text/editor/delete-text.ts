import { EditorInterface } from "..";

export const deleteText: EditorInterface['deleteText'] = (editor, distance = 1) => {
    const range = editor.getAnchorAndFocusOffset()
    if (!range) return
    if (editor.isCollapse()) {
        const idx = range.anchorOffset
        const characters = editor.textData.characters
        const newText = characters.slice(0, idx - distance) + characters.slice(idx)
        editor.textData.characters = newText
        editor.clearCache()
        editor.apply()
        editor.translateSelection(-distance)
    }
}