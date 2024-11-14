import { Editor } from "."

type FunctionType = (...args: any) => any
export type EventType = {
    setStyle: Set<FunctionType>
    selection: Set<FunctionType>
    layout: Set<FunctionType>
}
export type EventListenerType = <T extends keyof EventType>(editor: Editor, event: T, fn: FunctionType) => void