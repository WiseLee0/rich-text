import { EditorInterface, handleInsertTextOfTextDataLine } from "..";

export const insertText: EditorInterface['insertText'] = (editor, content) => {
    if (!editor.isEditor) return;
    if (!editor.hasSelection() && editor.isEditor) {
        editor.replaceText(content)
        editor.apply()
        editor.selectForCharacterOffset(content.length)
        return
    }
    if (!editor.isCollapse()) {
        editor.deleteText()
    }
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    const baselines = editor.getBaselines()
    if (!baselines?.length || !selectCharacterOffset) return
    const text = editor.getText()
    const characterIdx = selectCharacterOffset.anchor

    const stopInsert = handleInsertTextOfTextDataLine(editor, content)
    if (stopInsert) {
        editor.apply()
        return
    }
    const newText = text.substring(0, characterIdx) + content + text.substring(characterIdx)
    editor.replaceText(newText)

    // 更新局部样式表
    const { characterStyleIDs, characters } = editor.textData
    let styleID = characterStyleIDs?.[characterIdx - 1]
    if (characterIdx - 1 < 0 || characters[characterIdx - 1] === '\n') {
        styleID = characterStyleIDs?.[characterIdx]
    }
    if (characterStyleIDs?.length && styleID !== undefined) {
        const styleIDArr = new Array(content.length).fill(styleID)
        characterStyleIDs.splice(characterIdx, 0, ...styleIDArr)
    }
    editor.apply()
    editor.selectForCharacterOffset(characterIdx + content.length)
}