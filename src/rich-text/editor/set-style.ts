import { EditorInterface } from "..";

export const setStyle: EditorInterface['setStyle'] = (editor, style) => {
    if (style.fontName) {
        style.fontVariations = []
    }

    setCharacterStyleIDs(editor, style)
    setStyleOverrideTable(editor, style)

    editor.style = {
        ...editor.style,
        ...style
    }
}
const setCharacterStyleIDs: EditorInterface['setStyle'] = (editor, style) => {
    if (!editor.hasSelection() || editor.isCollapse()) return;
    const selectCharacterOffset = editor.getSelectCharacterOffset()
    if (!selectCharacterOffset) return;
    console.log(selectCharacterOffset);

    const changeStyles: typeof style = {}
    if (style['fontName']) {
        changeStyles['fontName'] = style['fontName']
    }
    if (style['fontSize']) {
        changeStyles['fontSize'] = style['fontSize']
    }
    if (style['textDecoration']) {
        changeStyles['textDecoration'] = style['textDecoration']
    }
    if (style['hyperlink']) {
        changeStyles['hyperlink'] = style['hyperlink']
    }
    if (!Object.keys(changeStyles).length) return



}
const setStyleOverrideTable: EditorInterface['setStyle'] = (editor, style) => {

}