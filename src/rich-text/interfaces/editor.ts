import { FontInterface, OmitFirstArg, SelectionInterface, StyleInterface, Selection, DerivedTextDataInterface, TextDataInterface, Font, MetricesInterface, BaseLineInterface, GlyphsInterface } from "."

export type Editor = {
    width: number
    height: number
    style: StyleInterface
    fonMgr: FontInterface
    selection: Selection
    derivedTextData: Partial<DerivedTextDataInterface>
    textData: TextDataInterface

    // cache
    __matrices?: MetricesInterface[]
    __baselines?: BaseLineInterface[]
    __glyphs?: GlyphsInterface[]

    setStyle: OmitFirstArg<EditorInterface['setStyle']>
    fontMgrFromData: OmitFirstArg<EditorInterface['fontMgrFromData']>
    setWH: OmitFirstArg<EditorInterface['setWH']>
    layout: OmitFirstArg<EditorInterface['layout']>
    apply: OmitFirstArg<EditorInterface['apply']>
    insertText: OmitFirstArg<EditorInterface['insertText']>
    deleteText: OmitFirstArg<EditorInterface['deleteText']>
    getMetrices: OmitFirstArg<EditorInterface['getMetrices']>
    getText: OmitFirstArg<EditorInterface['getText']>
    getFont: OmitFirstArg<EditorInterface['getFont']>
    getBaselines: OmitFirstArg<EditorInterface['getBaselines']>
    getGlyphs: OmitFirstArg<EditorInterface['getGlyphs']>
    clearCache: OmitFirstArg<EditorInterface['clearCache']>
    splitLines: OmitFirstArg<EditorInterface['splitLines']>
    getCursorRect: OmitFirstArg<EditorInterface['getCursorRect']>
    getLineWidths: OmitFirstArg<EditorInterface['getLineWidths']>
    transformCharactersOffset: OmitFirstArg<EditorInterface['transformCharactersOffset']>
    transformMetricesRange: OmitFirstArg<EditorInterface['transformMetricesRange']>


    // selection
    setSelection: OmitFirstArg<SelectionInterface['setSelection']>
    selectForXY: OmitFirstArg<SelectionInterface['selectForXY']>
    isCollapse: OmitFirstArg<SelectionInterface['isCollapse']>
    hasSelection: OmitFirstArg<SelectionInterface['hasSelection']>
    deselect: OmitFirstArg<SelectionInterface['deselect']>
    getAnchorAndFocusOffset: OmitFirstArg<SelectionInterface['getAnchorAndFocusOffset']>
    fixSelection: OmitFirstArg<SelectionInterface['fixSelection']>
    translateSelection: OmitFirstArg<SelectionInterface['translateSelection']>
}

export type EditorInterface = {
    fontMgrFromData: (editor: Editor, buffers: ArrayBuffer[]) => void
    getFont: (editor: Editor, family: string) => Font | undefined
    setStyle: (editor: Editor, style: Partial<StyleInterface>) => void
    setWH: (editor: Editor, width?: number, height?: number) => void
    layout: (editor: Editor, width?: number, height?: number) => void
    apply: (editor: Editor) => void
    insertText: (editor: Editor, text: string) => void
    deleteText: (editor: Editor, distance?: number) => void
    getText: (editor: Editor) => string
    getMetrices: (editor: Editor) => MetricesInterface[] | undefined
    getBaselines: (editor: Editor) => BaseLineInterface[] | undefined
    getGlyphs: (editor: Editor) => GlyphsInterface[] | undefined
    getCursorRect: (editor: Editor) => Rect | undefined
    clearCache: (editor: Editor) => void
    splitLines: (editor: Editor, maxWidth: number) => MetricesInterface[][] | undefined
    getLineWidths: (editor: Editor, baselineY: number) => number[] | undefined
    transformCharactersOffset: (editor: Editor, metrices: MetricesInterface[], offset: number) => number
    transformMetricesRange: (editor: Editor, firstCharacter: number, endCharacter: number) => [number, number]
}

export type Rect = [number, number, number, number]