import { EditorInterface, getCodePoints, getTextArr, handleInsertTextOfTextDataLine } from "..";

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
    const textArr = getTextArr(editor)
    const characterIdx = selectCharacterOffset.anchor

    const stopInsert = handleInsertTextOfTextDataLine(editor, content)
    if (stopInsert) {
        editor.apply()
        return
    }
    const newText = textArr.slice(0, characterIdx).join("") + content + textArr.slice(characterIdx).join("")
    editor.replaceText(newText)

    const contentLen = getCodePoints(content).length

    // 更新局部样式表
    const { characterStyleIDs, characters } = editor.textData
    let styleID = characterStyleIDs?.[characterIdx - 1]
    if (characterIdx - 1 < 0 || characters[characterIdx - 1] === '\n') {
        styleID = characterStyleIDs?.[characterIdx]
    }
    if (characterStyleIDs?.length && styleID !== undefined) {
        const styleIDArr = new Array(contentLen).fill(styleID)
        characterStyleIDs.splice(characterIdx, 0, ...styleIDArr)
    }
    editor.apply()
    editor.selectForCharacterOffset(characterIdx + contentLen)
}