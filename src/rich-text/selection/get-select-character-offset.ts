import { SelectionInterface } from ".."

export const getSelectCharacterOffset: SelectionInterface['getSelectCharacterOffset'] = (editor) => {
    if (!editor.hasSelection()) return;
    const selection = editor.getSelection()
    const baselines = editor.getBaselines()
    const text = editor.getText()
    const { anchor, focus, anchorOffset, focusOffset } = selection
    if (!baselines) return { anchor: 0, focus: 0 }

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

    // if (text[r_focus] === '\n') {
    //     r_focus++
    // }

    return {
        anchor: r_anchor,
        focus: r_focus
    }
}