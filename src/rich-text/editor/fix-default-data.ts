import { Editor, TextDataLinesInterface } from "..";

export const fixDefaultData = (editor: Editor) => {
    // 不存在textData Lines
    if (!editor.textData.lines) {
        defaultTextDataLines(editor)
    }
}

const defaultTextDataLines = (editor: Editor) => {
    const text = editor.getText()
    const splits = text.split('\n')
    const lines: TextDataLinesInterface[] = []
    for (let i = 0; i < splits.length; i++) {
        lines.push({
            lineType: "PLAIN",
            styleId: 0,
            indentationLevel: 0,
            sourceDirectionality: "AUTO",
            listStartOffset: 0,
            isFirstLineOfList: false
        })
    }
    editor.textData.lines = lines;
}