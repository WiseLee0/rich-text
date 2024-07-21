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
    selectForXY: (editor: Editor, x: number, y: number, isAnchor?: boolean) => void
    selectForCharacterOffset: (editor: Editor, characterOffset: number) => void
    getSelectionRects: (editor: Editor) => Rect[]
    isCollapse: (editor: Editor) => boolean
    hasSelection: (editor: Editor) => boolean
    deselection: (editor: Editor) => void
}

