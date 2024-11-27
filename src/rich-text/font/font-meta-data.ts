import { Editor, StyleInterface } from "..";

const loadURLSet = new Set()
export const loadFontMetaURL = (editor: Editor, fontName: StyleInterface['fontName']) => {
    const key = `${fontName.family}#${fontName.style}#${fontName.postscript}`
    const metaData = editor.fontMetaData.find(item => item.key === key)
    if (metaData?.assetURL && !loadURLSet.has(metaData.assetURL)) {
        loadURLSet.add(metaData.assetURL)
        editor.fontMgrFromURL(fontName, metaData.assetURL).then(() => {
            editor.apply()
            loadURLSet.delete(metaData.assetURL)
        })
    }
}

export const addFontMeta = (editor: Editor, fontName: StyleInterface['fontName'], url: string) => {
    const key = `${fontName.family}#${fontName.style}#${fontName.postscript}`
    const metaData = editor.fontMetaData.find(item => item.key === key)
    if (!metaData) {
        editor.fontMetaData.push({
            key,
            assetURL: url
        })
    }
}

export const resetFontMeta = (editor: Editor) => {
    const styleOverrideTable = editor.textData?.styleOverrideTable
    const metaSet = new Set<string>()
    if (!styleOverrideTable) return;
    const fontName = editor.style.fontName
    const key = `${fontName.family}#${fontName.style}#${fontName.postscript}`
    metaSet.add(key)
    for (let i = 0; i < styleOverrideTable.length; i++) {
        const override = styleOverrideTable[i];
        const fontName = override.fontName
        if (fontName) {
            const key = `${fontName.family}#${fontName.style}#${fontName.postscript}`
            metaSet.add(key)
        }
    }
    const metaData = editor.fontMetaData.filter(item => metaSet.has(item.key))
    editor.fontMetaData = metaData
}