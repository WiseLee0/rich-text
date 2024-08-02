import { EditorInterface } from ".."

export const removeEventListener: EditorInterface['addEventListener'] = (editor, type, fn) => {
    if (editor.__events[type]?.has(fn)) {
        editor.__events[type]!.delete(fn)
    }
}