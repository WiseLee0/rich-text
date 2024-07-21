import { EditorInterface } from "..";

export const insertText: EditorInterface['insertText'] = (editor, content) => {
    if (!editor.hasSelection()) return;
    if (!editor.isCollapse()) {
        editor.deleteText()
    }
    const selection = editor.getSelection()
    const baselines = editor.getBaselines()
    if (!baselines?.length) return
    let { anchor, anchorOffset } = selection
    const text = editor.getText()

    let characterIdx = 0
    if (anchor === baselines.length) {
        characterIdx = text.length
    } else {
        characterIdx = baselines[anchor].firstCharacter + anchorOffset
    }

    const newText = text.substring(0, characterIdx) + content + text.substring(characterIdx)
    editor.replaceText(newText)
    editor.clearCache()
    editor.apply()
    editor.selectForCharacterOffset(characterIdx + content.length)
}