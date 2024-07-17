import { EditorInterface } from "..";

export const layout: EditorInterface['layout'] = (editor, width, height) => {
    if (width === undefined && height === undefined) {
        editor.style.textAutoResize = 'WIDTH_AND_HEIGHT'
    }
    if (width !== undefined && height === undefined) {
        editor.style.textAutoResize = 'HEIGHT'
        editor.width = width
    }
    if (width !== undefined && height !== undefined) {
        editor.style.textAutoResize = 'NONE'
        editor.width = width
        editor.height = height
    }
    return editor.apply()
}

export const apply: EditorInterface['apply'] = (editor) => {
    if (editor.style.textAutoResize === 'WIDTH_AND_HEIGHT') {
        editor.width = Infinity
    }

    const baselines = editor.getBaselines() ?? []
    const glyphs = editor.getGlyphs()

    if (editor.style.textAutoResize === 'WIDTH_AND_HEIGHT' && baselines.length) {
        editor.width = Math.max(...baselines.map(item => item.width))
        editor.height = baselines[baselines.length - 1].lineY + baselines[baselines.length - 1].lineHeight
    }

    if (editor.style.textAutoResize === 'HEIGHT' && baselines.length) {
        editor.height = baselines[baselines.length - 1].lineY + baselines[baselines.length - 1].lineHeight
    }

    editor.derivedTextData = {
        baselines,
        glyphs
    }

    return editor.derivedTextData
}