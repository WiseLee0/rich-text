type StyleOverrideTableInterface = {
    [key in string]: any
}
export type TextDataLinesInterface = {
    lineType: "ORDERED_LIST" | "UNORDERED_LIST" | "PLAIN",
    styleId: number,
    indentationLevel: number,
    sourceDirectionality: "AUTO",
    listStartOffset: number,
    isFirstLineOfList: boolean
}
export interface TextDataInterface {
    characters: string,
    lines?: TextDataLinesInterface[],
    characterStyleIDs?: number[],
    styleOverrideTable?: StyleOverrideTableInterface[]
}
