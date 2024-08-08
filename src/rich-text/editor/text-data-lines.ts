import { Editor } from "..";

export const textDataLines = (editor: Editor) => {
    const text = editor.getText()
    const splits = text.split('\n')
    if (!editor.textData.lines?.length) {
        editor.textData.lines = new Array(splits.length)
        for (let i = 0; i < splits.length; i++) {
            editor.textData.lines[i] = {
                lineType: "PLAIN",
                indentationLevel: 0,
                isFirstLineOfList: false
            }
        }
    }
}