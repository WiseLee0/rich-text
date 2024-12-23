import { deepClone, EditorInterface, execEvent, getTextArr, handleInsertTextOfTextDataLine } from "..";

export const insertText: EditorInterface['insertText'] = (editor, content) => {
    if (!editor.isEditor) return;
    if (!editor.hasSelection() && content === '\n') {
        editor.__selection = { anchor: 0, focus: 0, anchorOffset: 0, focusOffset: 0 }
    }
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
    if (!selectCharacterOffset) return
    const textArr = getTextArr(editor)
    const characterIdx = selectCharacterOffset.anchor

    const stopInsert = handleInsertTextOfTextDataLine(editor, content)
    if (stopInsert) {
        editor.apply()
        return
    }
    const newText = textArr.slice(0, characterIdx).join("") + content + textArr.slice(characterIdx).join("")
    editor.replaceText(newText)

    const contentLen = Array.from(content).length;

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

    // 是否存在闭合区域样式
    const characterOffset = editor.getSelectCharacterOffset()
    if (characterOffset !== undefined && editor.isCollapse() && Object.keys(editor.__select_styles.styles || {}).length) {
        const styles = deepClone(editor.__select_styles.styles)!
        editor.selectForCharacterOffset(characterOffset.anchor, characterOffset.anchor + contentLen)
        editor.setStyle(styles)
        editor.deselection()
    }
    editor.apply()
    editor.selectForCharacterOffset(characterIdx + contentLen)
    execEvent(editor, 'selection');
}