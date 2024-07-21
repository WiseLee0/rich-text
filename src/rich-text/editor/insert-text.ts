import { EditorInterface } from "..";

export const insertText: EditorInterface['insertText'] = (editor, _content) => {
    if (!editor.hasSelection()) return;
    if (!editor.isCollapse()) {
        editor.deleteText()
    }
    const selection = editor.getSelection()
    const baselines = editor.getBaselines()
    if (!baselines?.length) return
    let { focus, anchor, focusOffset, anchorOffset } = selection
    const text = editor.getText()
    
}