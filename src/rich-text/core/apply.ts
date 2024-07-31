import { clearCache, EditorInterface, fixDefaultData, getH } from ".."

export const apply: EditorInterface['apply'] = (editor) => {
    clearCache(editor)
    if (editor.style.textAutoResize === 'WIDTH_AND_HEIGHT') {
        editor.width = Infinity
    }

    // 缺省数据，使用默认值填充
    fixDefaultData(editor)

    const baselines = editor.getBaselines() ?? []
    const glyphs = editor.getGlyphs()
    const logicalCharacterOffset = editor.getLogicalCharacterOffset()

    if (editor.style.textAutoResize === 'WIDTH_AND_HEIGHT') {
        editor.width = Math.max(...baselines.map(item => item.width), 0)
        editor.height = getH(editor)
    }

    if (editor.style.textAutoResize === 'HEIGHT') {
        editor.height = getH(editor)
    }

    editor.derivedTextData = {
        glyphs,
        baselines,
        logicalCharacterOffset
    }
    return editor.derivedTextData
}
