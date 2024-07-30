import * as fontkit from 'fontkit'
import { OmitFirstArg, SelectionInterface, StyleInterface, Selection, DerivedTextDataInterface, TextDataInterface, Font, MetricesInterface, BaseLineInterface, GlyphsInterface } from "."

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
    __selection: Selection
    __matrices?: MetricesInterface[]

    // core
    /** 布局段落中的文本，使其包装到给定的宽度和高度 */
    layout: OmitFirstArg<EditorInterface['layout']>
    /** 计算文本布局 */
    apply: OmitFirstArg<EditorInterface['apply']>

    // editor
    /** 设置样式 */
    setStyle: OmitFirstArg<EditorInterface['setStyle']>
    /** 获取样式 */
    getStyle: OmitFirstArg<EditorInterface['getStyle']>
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
    /** 清除计算缓存 */
    clearCache: OmitFirstArg<EditorInterface['clearCache']>

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
    getStyle: (editor: Editor, ignoreSelection?: boolean) => StyleInterface
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