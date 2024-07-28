import { Editor, fontMgrFromData, setStyle, layout, setSelection, getMetrices, insertText, getSelection, getFonts, getText, getBaselines, getGlyphs, clearCache, selectForXY, isCollapse, hasSelection, deselection, getBaseLineCharacterOffset, apply, deleteText, getLogicalCharacterOffset, getSelectionRects, replaceText, selectForCharacterOffset, getFont, getSelectCharacterOffset, } from './'

export const createEditor = (): Editor => {

    const editor: Editor = {
        width: 0,
        height: 0,
        fonMgr: new Map(),
        style: {
            fontSize: 12,
            textAlignHorizontal: 'LEFT',
            textAlignVertical: 'TOP',
            textAutoResize: 'WIDTH_AND_HEIGHT',
            fontName: {
                family: "Play", style: "Regular", postscript: "Play-Regular"
            },
            fontVariations: []
        },
        __selection: {
            anchor: -1,
            focus: -1,
            anchorOffset: -1,
            focusOffset: -1
        },
        derivedTextData: {},
        textData: {
            "characters": "hello\nworld"
        },

        // Core
        layout: (...args) => layout(editor, ...args),
        apply: (...args) => apply(editor, ...args),

        // Editor
        setStyle: (...args) => setStyle(editor, ...args),
        insertText: (...args) => insertText(editor, ...args),
        replaceText: (...args) => replaceText(editor, ...args),
        getText: (...args) => getText(editor, ...args),
        getMetrices: (...args) => getMetrices(editor, ...args),
        getBaselines: (...args) => getBaselines(editor, ...args),
        getGlyphs: (...args) => getGlyphs(editor, ...args),
        getLogicalCharacterOffset: (...args) => getLogicalCharacterOffset(editor, ...args),
        clearCache: (...args) => clearCache(editor, ...args),
        getBaseLineCharacterOffset: (...args) => getBaseLineCharacterOffset(editor, ...args),
        deleteText: (...args) => deleteText(editor, ...args),

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
    }

    return editor
}