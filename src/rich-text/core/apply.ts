import { clearCache, EditorInterface, execEvent, getH, getLineIndentationLevelPixels, getLogicalCharacterOffset } from ".."

export const apply: EditorInterface['apply'] = (editor) => {
    clearCache(editor)
    if (editor.style.textAutoResize === 'WIDTH_AND_HEIGHT') {
        editor.width = Infinity
    }

    const baselines = editor.getBaselines() ?? []
    const glyphs = editor.getGlyphs()
    const logicalCharacterOffset = getLogicalCharacterOffset(editor)

    if (editor.style.textAutoResize === 'WIDTH_AND_HEIGHT') {
        let lastW = 0
        if (editor.textData.characters[editor.textData.characters.length - 1] === '\n') {
            lastW = getLineIndentationLevelPixels(editor, baselines[baselines.length - 1].endCharacter)
        }
        editor.width = Math.max(...baselines.map(item => item.position.x + item.width), lastW)
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
    execEvent(editor, 'layout');
    return editor.derivedTextData
}
