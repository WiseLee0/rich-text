import * as fontkit from 'fontkit'
import { OmitFirstArg, SelectionInterface, StyleInterface, Selection, DerivedTextDataInterface, TextDataInterface, Font, MetricesInterface, BaseLineInterface, GlyphsInterface, FillPaintType, EventType, EventListenerType } from "."

export type Editor = {
    /** 文本宽度 */
    width: number
    /** 文本高度 */
    height: number
    /** 文本样式 */
    style: StyleInterface
    /** 字体管理 */
    fonMgr: Map<string, fontkit.Font[]>
    /** 文本排版信息 */
    derivedTextData: Partial<DerivedTextDataInterface>
    /** 文本数据信息 */
    textData: TextDataInterface

    // cache
    __events: Partial<EventType>
    __selection: Selection
    __select_styles: Partial<{ anchor: number, focus: number, styles: StyleInterface }>
    __metrices?: MetricesInterface[]

    // core
    /** 布局段落中的文本，使其包装到给定的宽度和高度 */
    layout: OmitFirstArg<EditorInterface['layout']>
    layoutW: OmitFirstArg<EditorInterface['layoutW']>
    layoutH: OmitFirstArg<EditorInterface['layoutH']>
    /** 计算文本布局 */
    apply: OmitFirstArg<EditorInterface['apply']>

    // editor
    /** 设置样式 */
    setStyle: OmitFirstArg<EditorInterface['setStyle']>
    /** 获取样式 */
    getStyle: OmitFirstArg<EditorInterface['getStyle']>
    /** 获取选区样式 */
    getStyleForSelection: OmitFirstArg<EditorInterface['getStyleForSelection']>
    /** 获取文本内容 */
    getText: OmitFirstArg<EditorInterface['getText']>
    /** 插入文本 */
    insertText: OmitFirstArg<EditorInterface['insertText']>
    /** 删除文本 */
    deleteText: OmitFirstArg<EditorInterface['deleteText']>
    /** 替换文本 */
    replaceText: OmitFirstArg<EditorInterface['replaceText']>
    /** 获取所有行的逻辑字符的偏移值（逻辑字符指的是输入的文本字符） */
    getLogicalCharacterOffset: OmitFirstArg<EditorInterface['getLogicalCharacterOffset']>
    /** 获取当前行逻辑字符的偏移值（逻辑字符指的是输入的文本字符 */
    getBaseLineCharacterOffset: OmitFirstArg<EditorInterface['getBaseLineCharacterOffset']>
    /** 获取字符的度量信息 */
    getMetrices: OmitFirstArg<EditorInterface['getMetrices']>
    /** 获取基线信息 */
    getBaselines: OmitFirstArg<EditorInterface['getBaselines']>
    /** 获取字符信息 */
    getGlyphs: OmitFirstArg<EditorInterface['getGlyphs']>
    /** 获取字符填充样式 */
    getFillPaintsForGlyph: OmitFirstArg<EditorInterface['getFillPaintsForGlyph']>
    /** 获取文本修饰矩形，用于绘制 */
    getTextDecorationRects: OmitFirstArg<EditorInterface['getTextDecorationRects']>
    /** 添加事件监听 */
    addEventListener: OmitFirstArg<EditorInterface['addEventListener']>
    /** 移除事件监听 */
    removeEventListener: OmitFirstArg<EditorInterface['removeEventListener']>

    // font
    /** 设置字体数据 */
    fontMgrFromData: OmitFirstArg<EditorInterface['fontMgrFromData']>
    /** 获取指定字体名称下的字体列表 */
    getFonts: OmitFirstArg<EditorInterface['getFonts']>
    /** 获取指定字体 */
    getFont: OmitFirstArg<EditorInterface['getFont']>

    // selection
    /** 设置光标选区 */
    setSelection: OmitFirstArg<SelectionInterface['setSelection']>
    /** 获取光标选区 */
    getSelection: OmitFirstArg<SelectionInterface['getSelection']>
    /** 通过XY位置，设置光标选区 */
    selectForXY: OmitFirstArg<SelectionInterface['selectForXY']>
    /** 通过字符偏移值，设置光标选区 */
    selectForCharacterOffset: OmitFirstArg<SelectionInterface['selectForCharacterOffset']>
    /** 通过光标选区，获取字符偏移值 */
    getSelectCharacterOffset: OmitFirstArg<SelectionInterface['getSelectCharacterOffset']>
    /** 光标是否闭合 */
    isCollapse: OmitFirstArg<SelectionInterface['isCollapse']>
    /** 是否存在选区 */
    hasSelection: OmitFirstArg<SelectionInterface['hasSelection']>
    /** 取消选区 */
    deselection: OmitFirstArg<SelectionInterface['deselection']>
    /** 获取选区范围矩形，用于绘制 */
    getSelectionRects: OmitFirstArg<SelectionInterface['getSelectionRects']>
}

export type EditorInterface = {
    fontMgrFromData: (editor: Editor, buffers: ArrayBuffer[]) => void
    getFonts: (editor: Editor, family?: string) => Font[] | undefined
    getFont: (editor: Editor, family?: string, style?: string) => Font | undefined
    setStyle: (editor: Editor, style: Partial<StyleInterface>) => void
    getStyleForSelection: (editor: Editor) => StyleInterface
    getStyle: (editor: Editor, firstCharacter?: number) => StyleInterface
    layout: (editor: Editor, width?: number, height?: number) => void
    layoutW: (editor: Editor, width: number) => void
    layoutH: (editor: Editor, height: number) => void
    apply: (editor: Editor) => void
    insertText: (editor: Editor, text: string) => void
    deleteText: (editor: Editor) => void
    replaceText: (editor: Editor, text: string) => void
    getText: (editor: Editor) => string
    getMetrices: (editor: Editor) => MetricesInterface[] | undefined
    getBaselines: (editor: Editor) => BaseLineInterface[] | undefined
    getGlyphs: (editor: Editor) => GlyphsInterface[] | undefined
    clearCache: (editor: Editor) => void
    clearGetStyleCache: (editor: Editor) => void
    getBaseLineCharacterOffset: (editor: Editor, baselineIdx: number) => number[] | undefined
    getLogicalCharacterOffset: (editor: Editor) => number[]
    getTextDecorationRects: (editor: Editor) => Rect[]
    getFillPaintsForGlyph: (editor: Editor, firstCharacter?: number) => FillPaintType[]
    addEventListener: EventListenerType
    removeEventListener: EventListenerType
    execEvent: (editor: Editor, type: keyof EventType) => void
    handleTextTruncation: (editor: Editor) => void
}

export type Rect = [number, number, number, number]