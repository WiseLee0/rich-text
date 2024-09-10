import { Editor, fontMgrFromData, setStyle, layout, setSelection, getMetrices, insertText, getSelection, getFonts, getText, getBaselines, getGlyphs, selectForXY, isCollapse, hasSelection, deselection, getBaseLineCharacterOffset, apply, deleteText, getSelectionRects, replaceText, selectForCharacterOffset, getFont, getSelectCharacterOffset, getStyleForSelection, getTextDecorationRects, getFillPaintsForGlyphs, addEventListener, removeEventListener, layoutW, layoutH, getStyle, getTextListTypeForSelection, setTextList, loadDefaultFont, getStyleForStyleID, addIndent, reduceIndent, selectAll } from './'
import detectLangModel from './detect-lang/pkg/detect_lang'
import wasmURL from './detect-lang/pkg/detect_lang_bg.wasm?url'
export const createEditor = async (): Promise<Editor> => {

    const editor: Editor = {
        width: 0,
        height: 0,
        fonMgr: new Map(),
        style: {
            fontSize: 24,
            textAlignHorizontal: "LEFT",
            textAlignVertical: "TOP",
            textAutoResize: 'WIDTH_AND_HEIGHT',
            fontName: {
                family: "Inter", style: "Regular", postscript: "Inter-Regular"
            },
            fillPaints: [
                {
                    "type": "SOLID",
                    "color": {
                        "r": 0.9,
                        "g": 0.14,
                        "b": 0.14,
                        "a": 1
                    },
                    "opacity": 0.7,
                    "visible": true,
                    "blendMode": "NORMAL"
                },
            ],
            paragraphIndent: 0,
            paragraphSpacing: 0,
            lineHeight: {
                units: "PERCENT",
                value: 100
            },
            letterSpacing: {
                "units": "PERCENT",
                "value": 0
            },
            fontVariations: {},
            fontLigatures: "ENABLE",
            textDecoration: "NONE",
            textCase: "NONE",
            fontPosition: "NONE",
            fontNumericFraction: "DISABLE",
            maxLines: 2,
            textTruncation: "DISABLE",
            truncationStartIndex: -1,
            truncatedHeight: -1,
            leadingTrim: "NONE"
        },
        __selection: {
            anchor: -1,
            focus: -1,
            anchorOffset: -1,
            focusOffset: -1
        },
        __select_styles: {},
        __events: {},
        isEditor: false,
        derivedTextData: {},
        textData: {
            characters: "emoji: 👩‍❤️‍👩😁🫣😶‍🌫️👨‍👩‍👧‍👦👻🙃😍😠🥳👦🏾\nEnglish: helloworld\nChinese: 我们的时代妳時代\nKorean: 한국어안녕하세요\nJapanese: こんにちは",
            lines: [
                {
                    "lineType": "ORDERED_LIST",
                    "indentationLevel": 1,
                    "isFirstLineOfList": true,
                    "listStartOffset": 0
                },
                {
                    "lineType": "ORDERED_LIST",
                    "indentationLevel": 1,
                    "isFirstLineOfList": false,
                    "listStartOffset": 0
                },
                {
                    "lineType": "ORDERED_LIST",
                    "indentationLevel": 1,
                    "isFirstLineOfList": false,
                    "listStartOffset": 0
                },
                {
                    "lineType": "ORDERED_LIST",
                    "indentationLevel": 1,
                    "isFirstLineOfList": false,
                    "listStartOffset": 0
                },
                {
                    "lineType": "ORDERED_LIST",
                    "indentationLevel": 1,
                    "isFirstLineOfList": false,
                    "listStartOffset": 0
                },
            ]
        },

        // Core
        layout: (...args) => layout(editor, ...args),
        layoutW: (...args) => layoutW(editor, ...args),
        layoutH: (...args) => layoutH(editor, ...args),
        apply: (...args) => apply(editor, ...args),

        // Editor
        setStyle: (...args) => setStyle(editor, ...args),
        getStyle: (...args) => getStyle(editor, ...args),
        getStyleForSelection: (...args) => getStyleForSelection(editor, ...args),
        insertText: (...args) => insertText(editor, ...args),
        replaceText: (...args) => replaceText(editor, ...args),
        getText: (...args) => getText(editor, ...args),
        getMetrices: (...args) => getMetrices(editor, ...args),
        getBaselines: (...args) => getBaselines(editor, ...args),
        getGlyphs: (...args) => getGlyphs(editor, ...args),
        getBaseLineCharacterOffset: (...args) => getBaseLineCharacterOffset(editor, ...args),
        deleteText: (...args) => deleteText(editor, ...args),
        getTextDecorationRects: (...args) => getTextDecorationRects(editor, ...args),
        getFillPaintsForGlyphs: (...args) => getFillPaintsForGlyphs(editor, ...args),
        addEventListener: (...args) => addEventListener(editor, ...args),
        removeEventListener: (...args) => removeEventListener(editor, ...args),
        getTextListTypeForSelection: (...args) => getTextListTypeForSelection(editor, ...args),
        setTextList: (...args) => setTextList(editor, ...args),
        getStyleForStyleID: (...args) => getStyleForStyleID(editor, ...args),
        addIndent: (...args) => addIndent(editor, ...args),
        reduceIndent: (...args) => reduceIndent(editor, ...args),

        // Font
        fontMgrFromData: (...args) => fontMgrFromData(editor, ...args),
        getFont: (...args) => getFont(editor, ...args),
        getFonts: (...args) => getFonts(editor, ...args),

        // Selection
        setSelection: (...args) => setSelection(editor, ...args),
        getSelection: (...args) => getSelection(editor, ...args),
        selectForXY: (...args) => selectForXY(editor, ...args),
        selectForCharacterOffset: (...args) => selectForCharacterOffset(editor, ...args),
        getSelectCharacterOffset: (...args) => getSelectCharacterOffset(editor, ...args),
        isCollapse: (...args) => isCollapse(editor, ...args),
        hasSelection: (...args) => hasSelection(editor, ...args),
        deselection: (...args) => deselection(editor, ...args),
        getSelectionRects: (...args) => getSelectionRects(editor, ...args),
        selectAll: (...args) => selectAll(editor, ...args),
    }

    await loadDefaultFont(editor)

    await detectLangModel(wasmURL)

    return editor
}