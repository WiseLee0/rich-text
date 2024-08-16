import { Editor, getLineIndexForCharacterOffset, getLineStyleID } from "..";

export const getLineIndentationLevelPixels = (editor: Editor, firstCharacter: number) => {
    const lineIdx = getLineIndexForCharacterOffset(editor, firstCharacter)
    const styleID = getLineStyleID(editor, firstCharacter)
    const firstStyle = editor.getStyleForStyleID(styleID)
    const textDataLine = editor.textData.lines?.[lineIdx]
    if (textDataLine && textDataLine?.indentationLevel > 0) {
        return textDataLine.indentationLevel * firstStyle.fontSize * 1.5
    }
    return 0
}