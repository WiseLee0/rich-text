import { Editor } from "..";

export type Selection = Range
export interface Range {
    anchor: [number, number] // [行下标，基于行的字符偏移]
    focus: [number, number]
}
export interface RangeOffset {
    anchorOffset: number
    focusOffset: number
}
export interface SelectionInterface {
    fixSelection: (editor: Editor) => void
    setSelection: (editor: Editor, selection: Range) => void
    selectForXY: (editor: Editor, x: number, y: number) => void
    isCollapse: (editor: Editor) => boolean
    hasSelection: (editor: Editor) => boolean
    deselect: (editor: Editor) => void
    getAnchorAndFocusOffset: (editor: Editor) => RangeOffset | undefined
    setSelectionOffset: (editor: Editor, offset: number) => void
}

