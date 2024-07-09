import { EditorInterface } from "..";

export const clearCache: EditorInterface['clearCache'] = (editor) => {
    editor.__baselines = undefined
    editor.__glyphs = undefined
    editor.__matrices = undefined
}