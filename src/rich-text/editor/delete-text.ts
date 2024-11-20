import { EditorInterface, getTextArr, handleDeleteTextOfTextDataLine, mergeStyleOverride } from "..";

export const deleteText: EditorInterface['deleteText'] = (editor, options = {}) => {
    if (!editor.hasSelection()) return;
    const baselines = editor.getBaselines()
    if (!baselines?.length) return

    if (editor.isCollapse()) {
        const selection = editor.getSelection()
        const offset = editor.getSelectCharacterOffset();
        if (offset === undefined) return;
        if (options.fn && options.command) {
            editor.selectForCharacterOffset(offset.anchor, baselines[selection.anchor].endCharacter);
        } else if (options.command) {
            editor.selectForCharacterOffset(offset.anchor - selection.anchorOffset, offset.anchor);
        } else if (options.fn) {
            // 向后删除
            editor.selectForCharacterOffset(offset.anchor, offset.anchor + 1);
        } else {
            // 向前删除
            editor.selectForCharacterOffset(offset.anchor - 1, offset.anchor);
        }
    }

    const selection = editor.getSelection()
    const textArr = getTextArr(editor)
    let { focus, anchor, focusOffset, anchorOffset } = selection

    const anchorCharacterIdx = baselines[anchor].firstCharacter + anchorOffset
    let focusCharacterIdx = 0
    if (focus === baselines.length) {
        focusCharacterIdx = textArr.length
    } else {
        focusCharacterIdx = baselines[focus].firstCharacter + focusOffset
    }

    const stopDelete = handleDeleteTextOfTextDataLine(editor)
    if (stopDelete) {
        editor.apply()
        return
    }
    const newText = textArr.slice(0, anchorCharacterIdx).join("") + textArr.slice(focusCharacterIdx).join("")
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