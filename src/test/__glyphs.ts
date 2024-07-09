import { getBaseLine } from "../richText/baseLine"
import { getGlyphs } from "../richText/glyphs"
import { familyTokenize, getMetrices } from "../richText/helper"
import { loadFont } from "./__helper"

export const testGlyphs = () => {
    const test1 = async () => {
        await loadFont()

        const data = {
            fontName: {
                family: "Play", style: "Regular", postscript: "Play-Regular"
            },
            textData: {
                characters: "twittle",
            },
            fontSize: 12,
        }
        const metrices = getMetrices(data, familyTokenize(data.textData))

        const baselines = getBaseLine({
            w: 22,
            ...metrices,
            data
        })
        const glyphs = getGlyphs({
            baselines,
            metrices
        })
        const answer = [
            {
                "commandsBlob": 0,
                "position": {
                    "x": 0,
                    "y": 11.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 0,
                "advance": 0.4020000100135803
            },
            {
                "commandsBlob": 1,
                "position": {
                    "x": 4.828125,
                    "y": 11.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 1,
                "advance": 0.7920000553131104
            },
            {
                "commandsBlob": 2,
                "position": {
                    "x": 14.33203125,
                    "y": 11.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 2,
                "advance": 0.2460000067949295
            },
            {
                "commandsBlob": 0,
                "position": {
                    "x": 17.28515625,
                    "y": 11.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 3,
                "advance": 0.4020000100135803
            },
            {
                "commandsBlob": 0,
                "position": {
                    "x": -0.17578125,
                    "y": 25.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 4,
                "advance": 0.4020000100135803
            },
            {
                "commandsBlob": 3,
                "position": {
                    "x": 4.65234375,
                    "y": 25.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 5,
                "advance": 0.2460000067949295
            },
            {
                "commandsBlob": 4,
                "position": {
                    "x": 7.60546875,
                    "y": 25.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 6,
                "advance": 0.5350000262260437
            }
        ]

        for (let i = 0; i < glyphs.length; i++) {
            const glyph = glyphs[i];
            for (const key in glyph) {
                if (key === 'commandsBlob') continue
                if (key === 'position') {
                    const value1 = (answer[i] as any)[key]
                    const value2 = (glyph as any)[key]
                    if (Math.abs(value1.x - value2.x) > 1 || Math.abs(value1.y - value2.y) > 1) {
                        console.error(`glyphs ${key}错误test1`);
                        return
                    }
                    continue
                }
                const value1 = (answer[i] as any)[key]
                const value2 = (glyph as any)[key]
                if (Math.abs(value1 - value2) > 1) {
                    console.error(`glyphs ${key}错误test1`);
                    return
                }
            }
        }
        console.log('glyphs test1 ✅');
    }

    const test2 = async () => {
        await loadFont()

        const data = {
            fontName: {
                family: "Play", style: "Regular", postscript: "Play-Regular"
            },
            textData: {
                characters: "twittle",
            },
            fontSize: 12,
        }
        const metrices = getMetrices(data, familyTokenize(data.textData))

        const baselines = getBaseLine({
            w: 8,
            ...metrices,
            data
        })
        const glyphs = getGlyphs({
            baselines,
            metrices
        })
        const answer = [
            {
                "commandsBlob": 0,
                "position": {
                    "x": 0,
                    "y": 11.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 0,
                "advance": 0.4020000100135803
            },
            {
                "commandsBlob": 1,
                "position": {
                    "x": 0,
                    "y": 25.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 1,
                "advance": 0.7920000553131104
            },
            {
                "commandsBlob": 2,
                "position": {
                    "x": 0,
                    "y": 39.302001953125
                },
                "fontSize": 12,
                "firstCharacter": 2,
                "advance": 0.2460000067949295
            },
            {
                "commandsBlob": 0,
                "position": {
                    "x": 2.953125,
                    "y": 39.302001953125
                },
                "fontSize": 12,
                "firstCharacter": 3,
                "advance": 0.4020000100135803
            },
            {
                "commandsBlob": 0,
                "position": {
                    "x": -0.17578125,
                    "y": 53.302001953125
                },
                "fontSize": 12,
                "firstCharacter": 4,
                "advance": 0.4020000100135803
            },
            {
                "commandsBlob": 3,
                "position": {
                    "x": 4.65234375,
                    "y": 53.302001953125
                },
                "fontSize": 12,
                "firstCharacter": 5,
                "advance": 0.2460000067949295
            },
            {
                "commandsBlob": 4,
                "position": {
                    "x": 0,
                    "y": 67.302001953125
                },
                "fontSize": 12,
                "firstCharacter": 6,
                "advance": 0.5350000262260437
            }
        ]

        for (let i = 0; i < glyphs.length; i++) {
            const glyph = glyphs[i];
            for (const key in glyph) {
                if (key === 'commandsBlob') continue
                if (key === 'position') {
                    const value1 = (answer[i] as any)[key]
                    const value2 = (glyph as any)[key]
                    if (Math.abs(value1.x - value2.x) > 1 || Math.abs(value1.y - value2.y) > 1) {
                        console.error(`glyphs ${key}错误test2`);
                        return
                    }
                    continue
                }
                const value1 = (answer[i] as any)[key]
                const value2 = (glyph as any)[key]
                if (Math.abs(value1 - value2) > 1) {
                    console.error(`glyphs ${key}错误test2`);
                    return
                }
            }
        }
        console.log('glyphs test2 ✅');
    }

    const test3 = async () => {
        await loadFont()

        const data = {
            fontName: {
                family: "Play", style: "Regular", postscript: "Play-Regular"
            },
            textData: {
                characters: "twittle",
                characterStyleIDs: [0, 16, 16],
                styleOverrideTable: [{
                    "styleID": 16,
                    "fontName": {
                        "family": "Resident Evil 7",
                        "style": "Regular",
                        "postscript": "ResidentEvil7"
                    },
                    "fontVersion": "",
                    "fontVariations": [],
                    "detachOpticalSizeFromFontSize": false
                }]
            },
            fontSize: 12,
        }
        const metrices = getMetrices(data, familyTokenize(data.textData))

        const baselines = getBaseLine({
            w: 16,
            ...metrices,
            data
        })
        const glyphs = getGlyphs({
            baselines,
            metrices
        })
        const answer = [
            {
                "commandsBlob": 0,
                "position": {
                    "x": 0,
                    "y": 11.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 0,
                "advance": 0.4020000100135803
            },
            {
                "commandsBlob": 1,
                "position": {
                    "x": 4.828125,
                    "y": 11.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 1,
                "advance": 0.36865234375
            },
            {
                "commandsBlob": 2,
                "position": {
                    "x": 9.2578125,
                    "y": 11.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 2,
                "advance": 0.09130859375
            },
            {
                "commandsBlob": 0,
                "position": {
                    "x": 10.359375,
                    "y": 11.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 3,
                "advance": 0.4020000100135803
            },
            {
                "commandsBlob": 0,
                "position": {
                    "x": -0.17578125,
                    "y": 25.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 4,
                "advance": 0.4020000100135803
            },
            {
                "commandsBlob": 3,
                "position": {
                    "x": 4.65234375,
                    "y": 25.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 5,
                "advance": 0.2460000067949295
            },
            {
                "commandsBlob": 4,
                "position": {
                    "x": 7.60546875,
                    "y": 25.302000045776367
                },
                "fontSize": 12,
                "firstCharacter": 6,
                "advance": 0.5350000262260437
            }
        ]

        for (let i = 0; i < glyphs.length; i++) {
            const glyph = glyphs[i];
            for (const key in glyph) {
                if (key === 'commandsBlob') continue
                if (key === 'position') {
                    const value1 = (answer[i] as any)[key]
                    const value2 = (glyph as any)[key]
                    if (Math.abs(value1.x - value2.x) > 1 || Math.abs(value1.y - value2.y) > 1) {
                        console.error(`glyphs ${key}错误test3`);
                        return
                    }
                    continue
                }
                const value1 = (answer[i] as any)[key]
                const value2 = (glyph as any)[key]
                if (Math.abs(value1 - value2) > 1) {
                    console.error(`glyphs ${key}错误test3`);
                    return
                }
            }
        }
        console.log('glyphs test3 ✅');
    }

    test1()
    test2()
    test3()
}