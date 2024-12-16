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
        const startIdx = characterStyleIDs.findIndex(item => item === id);
        let endIdx = startIdx + 1;
        while (characterStyleIDs[endIdx] === id) {
            endIdx++
        }
        const partText = text.slice(startIdx, endIdx);
        const partResult = transformTextCase(partText, textCase);
        text = text.slice(0, startIdx) + partResult + text.slice(endIdx)
    }

    return text
}

export const getTextArr = (editor: Editor, disableTextCaseText = true) => {
    return disableTextCaseText ? Array.from(editor.textData.characters) : Array.from(getText(editor))
}

const transformTextCase = (text: string, textCase: StyleInterface['textCase']) => {
    if (textCase === 'LOWER') {
        text = text.toLowerCase()
    }
    if (textCase === 'UPPER') {
        text = text.toUpperCase()
    }
    if (textCase === 'TITLE') {
        text = lineTokenize(text).map(item => `${item[0].toUpperCase()}${item.slice(1)}`).join('')
    }
    return text;
}