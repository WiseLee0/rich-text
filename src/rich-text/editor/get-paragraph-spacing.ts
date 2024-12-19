import { Editor, EditorInterface, getLineIndexForCharacterOffset, getTextArr } from "..";

export const getParagraphSpacing: EditorInterface['getParagraphSpacing'] = (editor: Editor) => {
    const offset = editor.getSelectCharacterOffset()
    const anchor = offset?.anchor ?? 0;
    const focus = Math.max((offset?.focus ?? getTextArr(editor).length) - 1, anchor);
    const anchorLineIdx = getLineIndexForCharacterOffset(editor, anchor);
    const focusLineIdx = getLineIndexForCharacterOffset(editor, focus);
    const { lines } = editor.textData

    if (!lines?.[anchorLineIdx] || !lines?.[focusLineIdx]) {
        return 0
    }

    let paragraphSpacing = -1
    for (let i = anchorLineIdx; i <= focusLineIdx; i++) {
        if (paragraphSpacing === -1) {
            paragraphSpacing = lines[i].paragraphSpacing
        }
        if (paragraphSpacing !== lines[i].paragraphSpacing) {
            return 'mix'
        }
    }
    return paragraphSpacing;
}

export const getParagraphSpacingForCharacterOffset: EditorInterface['getParagraphSpacingForCharacterOffset'] = (editor, firstCharacter) => {
    const anchorLineIdx = getLineIndexForCharacterOffset(editor, firstCharacter);
    const { lines } = editor.textData

    if (!lines?.[anchorLineIdx]) {
        return 0
    }

    return lines[anchorLineIdx].paragraphSpacing
}