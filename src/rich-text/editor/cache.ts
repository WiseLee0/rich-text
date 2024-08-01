import { EditorInterface } from "..";

export const clearCache: EditorInterface['clearCache'] = (editor) => {
    editor.derivedTextData = {}
    editor.__matrices = undefined
}

export const clearGetStyleCache: EditorInterface['clearGetStyleCache'] = (editor) => {
    editor.__select_styles = {}
}