import * as fontkit from 'fontkit'
import { OmitFirstArg, SelectionInterface, StyleInterface, Selection, DerivedTextDataInterface, TextDataInterface, Font, MetricesInterface, BaseLineInterface, GlyphsInterface, FillPaintType, EventType, EventListenerType, TextDataLinesInterface, FontMetaDataInterface } from "."

export type Editor = {
    /** 文本宽度 */
    width: number
    /** 文本高度 */
    height: number
    /** 文本样式 */
    style: StyleInterface
    /** 字体管理 */
    fonMgr: Map<string, fontkit.Font[]>
    /** 使用的字体信息 */
    fontMetaData: FontMetaDataInterface[]
    /** 文本排版信息 */
    derivedTextData: Partial<DerivedTextDataInterface>
    /** 文本数据信息 */
    textData: TextDataInterface
    /** 是否处于编辑态 */
    isEditor: boolean

    // cache
    __events: Partial<EventType>
    __selection: Selection
    __select_styles: Partial<{ anchor: number, focus: number, styles: StyleInterface }>
    __metrices?: MetricesInterface[]

    // core
    /** 布局段落中的文本，使其包装到给定的宽度和高度 */
    layout: OmitFirstArg<EditorInterface['layout']>
    /** 布局段落中的文本，使其包装到给定的宽度 */
    layoutW: OmitFirstArg<EditorInterface['layoutW']>
    /** 布局段落中的文本，使其包装到给定的高度 */
    layoutH: OmitFirstArg<EditorInterface['layoutH']>
    /** 执行文本布局 */
    apply: OmitFirstArg<EditorInterface['apply']>

    // editor
    /** 设置样式 */
    setStyle: OmitFirstArg<EditorInterface['setStyle']>
    /** 获取样式 */
    getStyle: OmitFirstArg<EditorInterface['getStyle']>
    /** 根据styleID获取样式 */
    getStyleForStyleID: OmitFirstArg<EditorInterface['getStyleForStyleID']>
    /** 获取选区样式 */
    getStyleForSelection: OmitFirstArg<EditorInterface['getStyleForSelection']>
    /** 碰撞检测 */
    isHoverForQuadrant: OmitFirstArg<EditorInterface['isHoverForQuadrant']>
    /** 获取文本内容 */
    getText: OmitFirstArg<EditorInterface['getText']>
    /** 插入文本 */
    insertText: OmitFirstArg<EditorInterface['insertText']>
    /** 删除文本 */
    deleteText: OmitFirstArg<EditorInterface['deleteText']>
    /** 替换文本 */
    replaceText: OmitFirstArg<EditorInterface['replaceText']>
    /** 设置文本列表 */
    setTextList: OmitFirstArg<EditorInterface['setTextList']>
    /** 增加缩进 */
    addIndent: OmitFirstArg<EditorInterface['addIndent']>
    /** 减少缩进 */
    reduceIndent: OmitFirstArg<EditorInterface['reduceIndent']>
    /** 增加字体大小 */
    addFontSize: OmitFirstArg<EditorInterface['addFontSize']>
    /** 减少字体大小 */
    reduceFontSize: OmitFirstArg<EditorInterface['reduceFontSize']>
    /** 增加行高 */
    addLineHeight: OmitFirstArg<EditorInterface['addLineHeight']>
    /** 减少行高 */
    reduceLineHeight: OmitFirstArg<EditorInterface['reduceLineHeight']>
    /** 增加字间距 */
    addLetterSpacing: OmitFirstArg<EditorInterface['addLetterSpacing']>
    /** 减少字间距 */
    reduceLetterSpacing: OmitFirstArg<EditorInterface['reduceLetterSpacing']>
    /** 获取自动行高的像素值 */
    getAutoLineHeightOfPixels: OmitFirstArg<EditorInterface['getAutoLineHeightOfPixels']>
    /** 设置段落间距 */
    setParagraphSpacing: OmitFirstArg<EditorInterface['setParagraphSpacing']>
    /** 获取段落间距 */
    getParagraphSpacing: OmitFirstArg<EditorInterface['getParagraphSpacing']>
    /** 光标方向移动 */
    arrowMove: OmitFirstArg<EditorInterface['arrowMove']>
    /** 获取选区文本列表类型 */
    getTextListTypeForSelection: OmitFirstArg<EditorInterface['getTextListTypeForSelection']>
    /** 获取当前行逻辑字符的偏移值（逻辑字符指的是输入的文本字符） */
    getBaseLineCharacterOffset: OmitFirstArg<EditorInterface['getBaseLineCharacterOffset']>
    /** 获取字符的度量信息 */
    getMetrices: OmitFirstArg<EditorInterface['getMetrices']>
    /** 获取基线信息 */
    getBaselines: OmitFirstArg<EditorInterface['getBaselines']>
    /** 获取字符信息 */
    getGlyphs: OmitFirstArg<EditorInterface['getGlyphs']>
    /** 获取所有字符填充样式 */
    getFillPaintsForGlyphs: OmitFirstArg<EditorInterface['getFillPaintsForGlyphs']>
    /** 获取文本修饰矩形，用于绘制 */
    getTextDecorationRects: OmitFirstArg<EditorInterface['getTextDecorationRects']>
    /** 添加事件监听 */
    addEventListener: OmitFirstArg<EditorInterface['addEventListener']>
    /** 移除事件监听 */
    removeEventListener: OmitFirstArg<EditorInterface['removeEventListener']>

    // font
    /** 设置字体数据 */
    fontMgrFromURL: OmitFirstArg<EditorInterface['fontMgrFromURL']>
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
    /** 全选 */
    selectAll: OmitFirstArg<SelectionInterface['selectAll']>
    /** 获取光标选区的位置 */
    getSelectionXY: OmitFirstArg<SelectionInterface['getSelectionXY']>
}

export type EditorInterface = {
    fontMgrFromData: (editor: Editor, buffers: ArrayBuffer[]) => void
    getFonts: (editor: Editor, family?: string) => Font[] | undefined
    getFont: (editor: Editor, family?: string, style?: string) => Font | undefined
    setStyle: (editor: Editor, style: Partial<StyleInterface>) => void
    getStyleForSelection: (editor: Editor) => StyleInterface
    getStyle: (editor: Editor, firstCharacter?: number, needClone?: boolean) => StyleInterface
    layout: (editor: Editor, width?: number, height?: number) => void
    layoutW: (editor: Editor, width: number) => void
    layoutH: (editor: Editor, height: number) => void
    apply: (editor: Editor) => void
    insertText: (editor: Editor, text: string) => void
    deleteText: (editor: Editor, options?: Partial<{ fn: boolean, option: boolean, command: boolean }>) => void
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
    getFillPaintsForGlyphs: (editor: Editor) => FillPaintType[][]
    getFillPaintsForGlyph: (editor: Editor, firstCharacter?: number) => FillPaintType[]
    addEventListener: EventListenerType
    removeEventListener: EventListenerType
    execEvent: (editor: Editor, type: keyof EventType) => void
    handleTextTruncation: (editor: Editor) => void
    getLineIndexForCharacterOffset: (editor: Editor, firstCharacter: number) => number
    getLineFirstCharacterList: (editor: Editor) => number[]
    setTextList: (editor: Editor, lineType: TextDataLinesInterface['lineType'], listStartOffset?: TextDataLinesInterface['listStartOffset']) => void
    getTextListTypeForSelection: (editor: Editor) => TextDataLinesInterface['lineType'] | 'mix' | ''
    getStyleForStyleID: (editor: Editor, styleID?: number, needClone?: boolean) => StyleInterface
    addIndent: (editor: Editor) => void
    reduceIndent: (editor: Editor) => void
    isHoverForQuadrant: (editor: Editor, x: number, y: number, radius: number) => boolean
    arrowMove: (editor: Editor, type: 'left' | 'right' | 'top' | 'bottom', options?: Partial<{ shift: boolean, command: boolean }>) => void
    fontMgrFromURL: (editor: Editor, fontName: StyleInterface['fontName'], ulr: string) => Promise<void>
    addFontSize: (editor: Editor) => void
    reduceFontSize: (editor: Editor) => void
    addLineHeight: (editor: Editor) => void
    reduceLineHeight: (editor: Editor) => void
    addLetterSpacing: (editor: Editor) => void
    reduceLetterSpacing: (editor: Editor) => void
    getAutoLineHeightOfPixels: (editor: Editor) => number | 'mix'
    setParagraphSpacing: (editor: Editor, paragraphSpacing: number) => void
    getParagraphSpacing: (editor: Editor) => number | 'mix'
    getParagraphSpacingForCharacterOffset: (editor: Editor, firstCharacter: number) => number
}

export type Rect = [number, number, number, number]