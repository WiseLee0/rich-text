import { EditorInterface } from "..";

export const deleteText: EditorInterface['deleteText'] = (editor) => {
    if (!editor.hasSelection()) return;
    const selection = editor.getSelection()
    const text = editor.getText()
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
    const newText = text.substring(0, anchorCharacterIdx) + text.substring(focusCharacterIdx)
    editor.replaceText(newText)
    editor.deselection()
    editor.clearCache()
    editor.apply()
}