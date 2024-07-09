type StyleOverrideTableInterface = {
    [key in string]: any
}
export interface TextDataInterface {
    characters: string,
    characterStyleIDs?: number[],
    styleOverrideTable?: StyleOverrideTableInterface[]
}
