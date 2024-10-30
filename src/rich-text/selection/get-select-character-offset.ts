import { getTextArr, SelectionInterface } from ".."

export const getSelectCharacterOffset: SelectionInterface['getSelectCharacterOffset'] = (editor) => {
    if (!editor.hasSelection()) return;
    const selection = editor.getSelection()
    const baselines = editor.getBaselines()
    const textArr = getTextArr(editor)
    const { anchor, focus, anchorOffset, focusOffset } = selection
    if (!baselines?.length) return { anchor: 0, focus: 0 }

    let r_anchor = 0
    let r_focus = 0


    if (anchor === baselines.length) {
        r_anchor = baselines[anchor - 1].endCharacter
    } else {
        r_anchor = baselines[anchor].firstCharacter + anchorOffset
    }

    if (focus === baselines.length) {
        r_focus = baselines[focus - 1].endCharacter
    } else {
        r_focus = baselines[focus].firstCharacter + focusOffset
    }

    // 比如：hello\nworld , 选中第一行应该是 hello\n
    if (textArr[r_anchor] !== '\n' && textArr[r_focus] === '\n') {
        r_focus++
    }

    return {
        anchor: r_anchor,
        focus: r_focus
    }
}