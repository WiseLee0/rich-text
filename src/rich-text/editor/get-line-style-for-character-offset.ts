import { EditorInterface } from "..";

export const getLineStyleForCharacterOffset: EditorInterface['getLineStyleForCharacterOffset'] = (editor, firstCharacter) => {
    const lineIdx = editor.getLineIndexForCharacterOffset(firstCharacter)
    const { lines, characters } = editor.textData
    if (!lines) return editor.getStyle()
    let firstIdx = lineIdx
    for (let i = lineIdx; i >= 0; i--) {
        if (lines[i].isFirstLineOfList) {
            firstIdx = i
            break
        }
    }
    let idx = 0
    for (let i = 0; i <= firstCharacter; i++) {
        if (idx === firstIdx) {
            return editor.getStyle(i)
        }
        if (characters[i] === '\n') idx++
    }
    return editor.getStyle()
}