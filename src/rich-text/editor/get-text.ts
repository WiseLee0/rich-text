import { Editor, EditorInterface, lineTokenize } from "..";

export const getText: EditorInterface['getText'] = (editor) => {
    let text = editor.textData.characters

    const textCase = editor.style.textCase
    if (textCase === 'LOWER') {
        text = text.toLowerCase()
    }
    if (textCase === 'UPPER') {
        text = text.toUpperCase()
    }
    if (textCase === 'TITLE') {
        text = lineTokenize(text).map(item => `${item[0].toUpperCase()}${item.slice(1)}`).join('')
    }

    return text
}

export const getTextArr = (editor: Editor) => {
    return Array.from(getText(editor))
}