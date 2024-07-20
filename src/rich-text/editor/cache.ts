import { EditorInterface } from "..";

export const clearCache: EditorInterface['clearCache'] = (editor) => {
    editor.derivedTextData = {}
    editor.__matrices = undefined
}