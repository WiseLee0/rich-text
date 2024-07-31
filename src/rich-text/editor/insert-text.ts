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
}