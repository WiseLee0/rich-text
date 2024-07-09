export type MetricesInfo = {
    xAdvances: number[],
    advanceHeights: number[],
    advanceWidths: number[],
    ascents: number[],
    fontSizes: number[],
    paths: string[]
}

export type BaseLineInfo = {
    position: {
        x: number,
        y: number
    },
    width: number,
    lineY: number,
    lineHeight: number,
    lineAscent: number,
    firstCharacter: number,
    endCharacter: number
}

export type GlyphsInfo = {
    commandsBlob: string;
    position: {
        x: number,
        y: number
    },
    fontSize: number,
    firstCharacter: number
}

type StyleOverrideTableInfo = {
    [key in string]: any
}
export type TextDataInfo = {
    characters: string,
    characterStyleIDs?: number[],
    styleOverrideTable?: StyleOverrideTableInfo[]
}

export type derivedTextDataInfo = {
    layoutSize: {
        x: number,
        y: number
    },
    baselines: BaseLineInfo[]
    glyphs: GlyphsInfo[]
}

export type FontNameInfo = {
    family: string,
    style: string,
    postscript: string
}

export type RichTextInfo = {
    fontName: FontNameInfo,
    fontSize: number,
    textData: TextDataInfo
    derivedTextData: derivedTextDataInfo
}