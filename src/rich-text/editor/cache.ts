import { EditorInterface } from "..";

export const clearCache: EditorInterface['clearCache'] = (editor) => {
    editor.derivedTextData = {}
    editor.__metrices = undefined
}

export const clearGetStyleCache: EditorInterface['clearGetStyleCache'] = (editor) => {
    editor.__select_styles = {}
}