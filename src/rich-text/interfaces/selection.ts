import { Editor, Rect } from "..";

export type Selection = Range
export interface Range {
    anchor: number,
    focus: number,
    anchorOffset: number
    focusOffset: number
}
export interface SelectionInterface {
    getSelection: (editor: Editor) => Selection
    setSelection: (editor: Editor, selection: Partial<Range>) => void
    selectForXY: (editor: Editor, x: number, y: number, options?: Partial<{ shift: boolean, click: boolean, move: boolean, clickCount: number }>) => void
    selectForCharacterOffset: (editor: Editor, startCharacterOffset: number, endCharacterOffset?: number) => void
    getSelectCharacterOffset: (editor: Editor) => { anchor: number, focus: number } | undefined
    getSelectionRects: (editor: Editor) => Rect[]
    isCollapse: (editor: Editor) => boolean
    hasSelection: (editor: Editor) => boolean
    deselection: (editor: Editor) => void
    selectAll: (editor: Editor) => void
    getSelectionXY: (editor: Editor) => number[]
}

