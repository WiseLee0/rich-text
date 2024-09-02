import { EditorInterface, handleDeleteTextOfTextDataLine, mergeStyleOverride } from "..";

export const deleteText: EditorInterface['deleteText'] = (editor) => {
    if (!editor.hasSelection()) return;
    const selection = editor.getSelection()
    const text = Array.from(editor.getText())
    const baselines = editor.getBaselines()
    if (!baselines?.length) return
    let { focus, anchor, focusOffset, anchorOffset } = selection
    if (editor.isCollapse()) {
        anchorOffset -= 1;
        if (anchorOffset === -1) {
            anchor -= 1
            if (anchor >= 0) {
                const anchorBaseline = baselines[anchor]
                anchorOffset = (anchorBaseline.endCharacter - anchorBaseline.firstCharacter) - 1
            } else {
                anchor += 1
                anchorOffset = 0
            }
        }
    }

    const anchorCharacterIdx = baselines[anchor].firstCharacter + anchorOffset
    let focusCharacterIdx = 0
    if (focus === baselines.length) {
        focusCharacterIdx = text.length
    } else {
        focusCharacterIdx = baselines[focus].firstCharacter + focusOffset
    }

    const stopDelete = handleDeleteTextOfTextDataLine(editor)
    if (stopDelete) {
        editor.apply()
        return
    }
    const newText = text.slice(0, anchorCharacterIdx).join("") + text.slice(focusCharacterIdx).join("")
    editor.replaceText(newText)
    
    // 删除空了
    if (newText === '') {
        editor.setSelection({
            anchor: -1,
            focus: -1,
            focusOffset: -1,
            anchorOffset: -1
        })
        editor.textData.lines = [{
            lineType: 'PLAIN',
            listStartOffset: 0,
            isFirstLineOfList: true,
            indentationLevel: 0
        }]
        editor.apply()
        return
    }

    // 更新局部样式表
    const { characterStyleIDs, styleOverrideTable } = editor.textData
    if (characterStyleIDs?.length && styleOverrideTable?.length) {
        characterStyleIDs?.splice(anchorCharacterIdx, focusCharacterIdx - anchorCharacterIdx)
        mergeStyleOverride(editor, characterStyleIDs, styleOverrideTable)
    }
    editor.selectForCharacterOffset(anchorCharacterIdx)
    editor.apply()
}