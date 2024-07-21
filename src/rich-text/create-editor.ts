import { Editor, fontMgrFromData, setStyle, setWH, layout, setSelection, getMetrices, insertText, getSelection, getFont, getText, getBaselines, getGlyphs, clearCache, selectForXY, isCollapse, hasSelection, deselection, getBaseLineCharacterOffset, apply, deleteText, getLogicalCharacterOffset, getSelectionRects, replaceText, selectForCharacterOffset } from './'

export const createEditor = (): Editor => {

    const editor: Editor = {
        width: 0,
        height: 0,
        fonMgr: {
            fonts: [],
            collections: []
        },
        style: {
            fontSize: 12,
            textAlignHorizontal: 'left',
            textAlignVertical: 'top',
            textAutoResize: 'WIDTH_AND_HEIGHT',
            fontName: {
                family: "Play", style: "Regular", postscript: "Play-Regular"
            },
        },
        __selection: {
            anchor: -1,
            focus: -1,
            anchorOffset: -1,
            focusOffset: -1
        },
        derivedTextData: {},
        textData: {
            characters: "hello\n\n\nworld\nworld\nworld\n\n",
        },

        // Core
        layout: (...args) => layout(editor, ...args),
        apply: (...args) => apply(editor, ...args),

        // Editor
        setStyle: (...args) => setStyle(editor, ...args),
        fontMgrFromData: (...args) => fontMgrFromData(editor, ...args),
        setWH: (...args) => setWH(editor, ...args),
        insertText: (...args) => insertText(editor, ...args),
        replaceText: (...args) => replaceText(editor, ...args),
        getText: (...args) => getText(editor, ...args),
        getFont: (...args) => getFont(editor, ...args),
        getMetrices: (...args) => getMetrices(editor, ...args),
        getBaselines: (...args) => getBaselines(editor, ...args),
        getGlyphs: (...args) => getGlyphs(editor, ...args),
        getLogicalCharacterOffset: (...args) => getLogicalCharacterOffset(editor, ...args),
        clearCache: (...args) => clearCache(editor, ...args),
        getBaseLineCharacterOffset: (...args) => getBaseLineCharacterOffset(editor, ...args),
        deleteText: (...args) => deleteText(editor, ...args),


        // Selection
        setSelection: (...args) => setSelection(editor, ...args),
        getSelection: (...args) => getSelection(editor, ...args),
        selectForXY: (...args) => selectForXY(editor, ...args),
        selectForCharacterOffset: (...args) => selectForCharacterOffset(editor, ...args),
        isCollapse: (...args) => isCollapse(editor, ...args),
        hasSelection: (...args) => hasSelection(editor, ...args),
        deselection: (...args) => deselection(editor, ...args),
        getSelectionRects: (...args) => getSelectionRects(editor, ...args),
    }

    return editor
}