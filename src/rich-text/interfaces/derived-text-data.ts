import { BaseLineInterface, GlyphsInterface } from "."


export interface DerivedTextDataInterface {
    baselines: BaseLineInterface[]
    glyphs: GlyphsInterface[]
    truncationStartIndex: number
    truncatedHeight: number
    logicalCharacterOffset: number[]
}
