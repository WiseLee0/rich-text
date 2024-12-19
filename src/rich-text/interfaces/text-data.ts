type StyleOverrideTableInterface = {
    [key in string]: any
}
export type TextDataLinesInterface = {
    lineType: "ORDERED_LIST" | "UNORDERED_LIST" | "PLAIN",
    indentationLevel: number,
    listStartOffset: number,
    isFirstLineOfList: boolean,
    paragraphSpacing: number
}
export interface TextDataInterface {
    characters: string,
    lines?: TextDataLinesInterface[],
    characterStyleIDs?: number[],
    styleOverrideTable?: StyleOverrideTableInterface[]
}
