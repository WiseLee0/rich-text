import { Editor, EditorInterface, lineTokenize, StyleInterface } from "..";

export const getText: EditorInterface['getText'] = (editor) => {
    let text = transformTextCase(editor.textData.characters, editor.style.textCase)
    const { styleOverrideTable, characterStyleIDs } = editor.textData
    if (!characterStyleIDs?.length || !styleOverrideTable?.length) return text

    const idMap = new Map<number, StyleInterface['textCase']>()

    for (let i = 0; i < styleOverrideTable.length; i++) {
        const override = styleOverrideTable[i];
        if (!override.textCase) continue;
        idMap.set(override.styleID, override.textCase);
    }

    if (!idMap.size) return text;


    for (const [id, textCase] of idMap) {
        const textArr = Array.from(text);
        const startIdx = characterStyleIDs.findIndex(item => item === id);
        let endIdx = startIdx + 1;
        while (characterStyleIDs[endIdx] === id) {
            endIdx++
        }
        const partResult = transformTextCase(text, textCase, startIdx, endIdx);
        text = textArr.slice(0, startIdx).join('') + partResult + textArr.slice(endIdx).join('')
    }

    return text
}

export const getTextArr = (editor: Editor, disableTextCaseText = true) => {
    return disableTextCaseText ? Array.from(editor.textData.characters) : Array.from(getText(editor))
}

const transformTextCase = (_text: string, textCase: StyleInterface['textCase'], startIdx?: number, endIdx?: number) => {
    let text = _text

    const textArr = Array.from(_text)
    if (startIdx !== undefined && endIdx !== undefined) {
        text = textArr.slice(startIdx, endIdx).join('')
    } else if (startIdx !== undefined) {
        text = textArr.slice(startIdx).join('')
    }

    if (textCase === 'LOWER') {
        text = text.toLowerCase()
    }
    if (textCase === 'UPPER') {
        text = text.toUpperCase()
    }
    if (textCase === 'TITLE') {
        text = lineTokenize(text).map(item => `${item[0].toUpperCase()}${item.slice(1)}`).join('')
        if (startIdx && textArr[startIdx - 1] !== ' ') {
            text = textArr[startIdx] + text.slice(1)
        }
    }
    return text;
}