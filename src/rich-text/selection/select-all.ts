import { getTextArr, SelectionInterface } from "..";

export const selectAll: SelectionInterface['selectAll'] = (editor) => {
    editor.setSelection({
        anchor: 0,
        focus: editor.getBaselines()?.length ?? 0,
        anchorOffset: 0,
        focusOffset: getTextArr(editor).length
    })
}