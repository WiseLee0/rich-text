import { clearCache, EditorInterface, getH } from ".."

export const apply: EditorInterface['apply'] = (editor) => {
    clearCache(editor)
    if (editor.style.textAutoResize === 'WIDTH_AND_HEIGHT') {
        editor.width = Infinity
    }

    const baselines = editor.getBaselines() ?? []
    const glyphs = editor.getGlyphs()
    const logicalCharacterOffset = editor.getLogicalCharacterOffset()

    if (editor.style.textAutoResize === 'WIDTH_AND_HEIGHT') {
        editor.width = Math.max(...baselines.map(item => item.position.x + item.width), 0)
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
