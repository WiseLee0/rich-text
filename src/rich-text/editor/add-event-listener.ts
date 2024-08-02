import { EditorInterface } from "..";

export const addEventListener: EditorInterface['addEventListener'] = (editor, type, fn) => {
    if (editor.__events[type]) {
        editor.__events[type]!.add(fn)
    } else {
        editor.__events[type] = new Set([fn])
    }
}

export const execEvent: EditorInterface['execEvent'] = (editor, type) => {
    if (editor.__events[type]) {
        for (const fn of editor.__events[type]!) {
            fn()
        }
    }
}