import { Editor, EditorInterface, getLineIndexForCharacterOffset, getTextArr } from "..";

export const setParagraphSpacing: EditorInterface['setParagraphSpacing'] = (editor: Editor, paragraphSpacing: number) => {
    const offset = editor.getSelectCharacterOffset()
    const anchor = offset?.anchor ?? 0;
    const focus = Math.max((offset?.focus ?? getTextArr(editor).length) - 1, anchor);
    const anchorLineIdx = getLineIndexForCharacterOffset(editor, anchor);
    const focusLineIdx = getLineIndexForCharacterOffset(editor, focus);
    const { lines } = editor.textData

    if (!lines?.[anchorLineIdx] || !lines?.[focusLineIdx]) {
        return
    }

    for (let i = anchorLineIdx; i <= focusLineIdx; i++) {
        lines[i].paragraphSpacing = paragraphSpacing
    }

    editor.apply();
}