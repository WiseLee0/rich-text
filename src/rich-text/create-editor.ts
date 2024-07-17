import { Editor, fontMgrFromData, setStyle, setWH, layout, setSelection, getMetrices, insertText, getFont, getText, getBaselines, getGlyphs, clearCache, splitLines, getCursorRect, selectForXY, isCollapse, hasSelection, deselect, getLineWidths, getAnchorAndFocusOffset, apply, transformCharactersOffset, transformMetricesRange, fixSelection, deleteText, translateSelection } from './'

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
        selection: {
            anchor: [-1, -1],
            focus: [-1, -1],
        },
        derivedTextData: {},
        textData: {
            characters: "twittle",
        },

        // Core
        layout: (...args) => layout(editor, ...args),
        apply: (...args) => apply(editor, ...args),

        // Editor
        setStyle: (...args) => setStyle(editor, ...args),
        fontMgrFromData: (...args) => fontMgrFromData(editor, ...args),
        setWH: (...args) => setWH(editor, ...args),
        insertText: (...args) => insertText(editor, ...args),
        getMetrices: (...args) => getMetrices(editor, ...args),
        getText: (...args) => getText(editor, ...args),
        getFont: (...args) => getFont(editor, ...args),
        getBaselines: (...args) => getBaselines(editor, ...args),
        getGlyphs: (...args) => getGlyphs(editor, ...args),
        clearCache: (...args) => clearCache(editor, ...args),
        splitLines: (...args) => splitLines(editor, ...args),
        getCursorRect: (...args) => getCursorRect(editor, ...args),
        getLineWidths: (...args) => getLineWidths(editor, ...args),
        transformCharactersOffset: (...args) => transformCharactersOffset(editor, ...args),
        transformMetricesRange: (...args) => transformMetricesRange(editor, ...args),
        deleteText: (...args) => deleteText(editor, ...args),


        // Selection
        setSelection: (...args) => setSelection(editor, ...args),
        selectForXY: (...args) => selectForXY(editor, ...args),
        isCollapse: (...args) => isCollapse(editor, ...args),
        hasSelection: (...args) => hasSelection(editor, ...args),
        deselect: (...args) => deselect(editor, ...args),
        getAnchorAndFocusOffset: (...args) => getAnchorAndFocusOffset(editor, ...args),
        fixSelection: (...args) => fixSelection(editor, ...args),
        translateSelection: (...args) => translateSelection(editor, ...args),
    }

    return editor
}