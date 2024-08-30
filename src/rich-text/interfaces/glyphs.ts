export interface GlyphsInterface {
    commandsBlob: string;
    position: {
        x: number,
        y: number
    }
    fontSize: number
    firstCharacter?: number
    xAdvance?: number
    styleID?: number
    emojiCodePoints?: number[]
    emojiRect?: number[]
}