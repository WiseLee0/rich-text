import * as fontkit from 'fontkit'
import { OmitFirstArg, SelectionInterface, StyleInterface, Selection, DerivedTextDataInterface, TextDataInterface, Font, MetricesInterface, BaseLineInterface, GlyphsInterface } from "."

export type Editor = {
    width: number
    height: number
    style: StyleInterface
    fonMgr: Map<string, fontkit.Font[]>
    derivedTextData: Partial<DerivedTextDataInterface>
    textData: TextDataInterface

    // cache
    __selection: Selection
    __matrices?: MetricesInterface[]

    // editor
    setStyle: OmitFirstArg<EditorInterface['setStyle']>
    fontMgrFromData: OmitFirstArg<EditorInterface['fontMgrFromData']>
    setWH: OmitFirstArg<EditorInterface['setWH']>
    layout: OmitFirstArg<EditorInterface['layout']>
    apply: OmitFirstArg<EditorInterface['apply']>
    insertText: OmitFirstArg<EditorInterface['insertText']>
    deleteText: OmitFirstArg<EditorInterface['deleteText']>
    replaceText: OmitFirstArg<EditorInterface['replaceText']>
    getMetrices: OmitFirstArg<EditorInterface['getMetrices']>
    getLogicalCharacterOffset: OmitFirstArg<EditorInterface['getLogicalCharacterOffset']>
    getText: OmitFirstArg<EditorInterface['getText']>
    getFonts: OmitFirstArg<EditorInterface['getFonts']>
    getFont: OmitFirstArg<EditorInterface['getFont']>
    getFontFamilys: OmitFirstArg<EditorInterface['getFontFamilys']>
    getFontStyles: OmitFirstArg<EditorInterface['getFontStyles']>
    getBaselines: OmitFirstArg<EditorInterface['getBaselines']>
    getGlyphs: OmitFirstArg<EditorInterface['getGlyphs']>
    clearCache: OmitFirstArg<EditorInterface['clearCache']>
    getBaseLineCharacterOffset: OmitFirstArg<EditorInterface['getBaseLineCharacterOffset']>

    // selection
    setSelection: OmitFirstArg<SelectionInterface['setSelection']>
    getSelection: OmitFirstArg<SelectionInterface['getSelection']>
    selectForXY: OmitFirstArg<SelectionInterface['selectForXY']>
    selectForCharacterOffset: OmitFirstArg<SelectionInterface['selectForCharacterOffset']>
    isCollapse: OmitFirstArg<SelectionInterface['isCollapse']>
    hasSelection: OmitFirstArg<SelectionInterface['hasSelection']>
    deselection: OmitFirstArg<SelectionInterface['deselection']>
    getSelectionRects: OmitFirstArg<SelectionInterface['getSelectionRects']>
}

export type EditorInterface = {
    fontMgrFromData: (editor: Editor, buffers: ArrayBuffer[]) => void
    getFonts: (editor: Editor, family?: string) => Font[] | undefined
    getFont: (editor: Editor, family?: string, style?: string) => Font | undefined
    getFontFamilys: (editor: Editor) => string[]
    getFontStyles: (editor: Editor, family?: string) => string[]
    setStyle: (editor: Editor, style: Partial<StyleInterface>) => void
    setWH: (editor: Editor, width?: number, height?: number) => void
    layout: (editor: Editor, width?: number, height?: number) => void
    apply: (editor: Editor) => void
    insertText: (editor: Editor, text: string) => void
    deleteText: (editor: Editor) => void
    replaceText: (editor: Editor, text: string) => void
    getText: (editor: Editor) => string
    getMetrices: (editor: Editor) => MetricesInterface[] | undefined
    getBaselines: (editor: Editor) => BaseLineInterface[] | undefined
    getGlyphs: (editor: Editor) => GlyphsInterface[] | undefined
    clearCache: (editor: Editor) => void
    getBaseLineCharacterOffset: (editor: Editor, baselineIdx: number) => number[] | undefined
    getLogicalCharacterOffset: (editor: Editor) => number[]
}

export type Rect = [number, number, number, number]