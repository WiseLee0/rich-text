import { clearGetStyleCache, execEvent, SelectionInterface } from ".."

export const deselection: SelectionInterface['deselection'] = (editor) => {
    
    clearGetStyleCache(editor)

    editor.__selection = {
        anchor: -1,
        focus: -1,
        anchorOffset: -1,
        focusOffset: -1
    }
    editor.isEditor = false
    execEvent(editor, 'selection')
}
