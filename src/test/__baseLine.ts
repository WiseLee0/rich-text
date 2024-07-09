import { getBaseLine } from "../richText/baseLine"
import { familyTokenize, getMetrices } from "../richText/helper"
import { loadFont } from "./__helper"

export const testBaseLine = () => {
    const test1 = async () => {
        await loadFont()

        const data = {
            fontName: {
                family: "Play", style: "Regular", postscript: "Play-Regular"
            },
            textData: {
                characters: "twittle",
                characterStyleIDs: [0, 0, 0, 5, 5],
                styleOverrideTable: [
                    {
                        styleID: 5,
                        fontSize: 36
                    }
                ],
            },
            fontSize: 12,
        }
        const metrices = getMetrices(data, familyTokenize(data.textData))

        const baseLines = getBaseLine({
            w: 40,
            ...metrices,
            data
        })
        const answer = [
            {
                "position": {
                    "x": 0,
                    "y": 33.90599822998047
                },
                "width": 31.20703125,
                "lineHeight": 42,
                "lineAscent": 33,
                "firstCharacter": 0,
                "endCharacter": 4
            },
            {
                "position": {
                    "x": 0,
                    "y": 75.90599822998047
                },
                "width": 23.33203125,
                "lineHeight": 42,
                "lineAscent": 33,
                "firstCharacter": 4,
                "endCharacter": 7
            }
        ]
        for (let i = 0; i < baseLines.length; i++) {
            const baseLine = baseLines[i];
            for (const key in baseLine) {
                if (key === 'position') {
                    const value1 = (answer[i] as any)[key]
                    const value2 = (baseLine as any)[key]
                    if (Math.abs(value1.x - value2.x) > 1 || Math.abs(value1.y - value2.y) > 1) {
                        console.error(`baseLine ${key}错误test1`);
                        return
                    }
                    continue
                }
                const value1 = (answer[i] as any)[key]
                const value2 = (baseLine as any)[key]
                if (Math.abs(value1 - value2) > 1) {
                    console.error(`baseLine ${key}错误test1`);
                    return
                }
            }
        }
        console.log('baseLine test1 ✅');
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

        const baseLines = getBaseLine({
            w: 8,
            ...metrices,
            data
        })

        const answer = [
            {
                "position": {
                    "x": 0,
                    "y": 11.302000045776367
                },
                "width": 4.828125,
                "lineY": 4.577636758540393e-8,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 0,
                "endCharacter": 1
            },
            {
                "position": {
                    "x": 0,
                    "y": 25.302000045776367
                },
                "width": 9.50390625,
                "lineY": 14,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 1,
                "endCharacter": 2
            },
            {
                "position": {
                    "x": 0,
                    "y": 39.302001953125
                },
                "width": 7.59375,
                "lineY": 28.000001907348633,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 2,
                "endCharacter": 4
            },
            {
                "position": {
                    "x": 0,
                    "y": 53.302001953125
                },
                "width": 7.60546875,
                "lineY": 42.000003814697266,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 4,
                "endCharacter": 6
            },
            {
                "position": {
                    "x": 0,
                    "y": 67.302001953125
                },
                "width": 6.421875,
                "lineY": 56.000003814697266,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 6,
                "endCharacter": 7
            }
        ]
        for (let i = 0; i < baseLines.length; i++) {
            const baseLine = baseLines[i];
            for (const key in baseLine) {
                if (key === 'position') {
                    const value1 = (answer[i] as any)[key]
                    const value2 = (baseLine as any)[key]
                    if (Math.abs(value1.x - value2.x) > 1 || Math.abs(value1.y - value2.y) > 1) {
                        console.error(`baseLine ${key}错误test2`);
                        return
                    }
                    continue
                }
                const value1 = (answer[i] as any)[key]
                const value2 = (baseLine as any)[key]
                if (Math.abs(value1 - value2) > 1) {
                    console.error(`baseLine ${key}错误test2`);
                    return
                }
            }
        }
        console.log('baseLine test2 ✅');
    }

    const test3 = async () => {
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

        const baseLines = getBaseLine({
            w: 4,
            ...metrices,
            data
        })
        const answer = [
            {
                "position": {
                    "x": 0,
                    "y": 11.302000045776367
                },
                "width": 4.828125,
                "lineY": 4.577636758540393e-8,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 0,
                "endCharacter": 1
            },
            {
                "position": {
                    "x": 0,
                    "y": 25.302000045776367
                },
                "width": 9.50390625,
                "lineY": 14,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 1,
                "endCharacter": 2
            },
            {
                "position": {
                    "x": 0,
                    "y": 39.302001953125
                },
                "width": 2.953125,
                "lineY": 28.000001907348633,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 2,
                "endCharacter": 3
            },
            {
                "position": {
                    "x": 0,
                    "y": 53.302001953125
                },
                "width": 4.640625,
                "lineY": 42.000003814697266,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 3,
                "endCharacter": 4
            },
            {
                "position": {
                    "x": 0,
                    "y": 67.302001953125
                },
                "width": 4.65234375,
                "lineY": 56.000003814697266,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 4,
                "endCharacter": 5
            },
            {
                "position": {
                    "x": 0,
                    "y": 81.302001953125
                },
                "width": 2.953125,
                "lineY": 70,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 5,
                "endCharacter": 6
            },
            {
                "position": {
                    "x": 0,
                    "y": 95.302001953125
                },
                "width": 6.421875,
                "lineY": 84,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 6,
                "endCharacter": 7
            }
        ]
        for (let i = 0; i < baseLines.length; i++) {
            const baseLine = baseLines[i];
            for (const key in baseLine) {
                if (key === 'position') {
                    const value1 = (answer[i] as any)[key]
                    const value2 = (baseLine as any)[key]
                    if (Math.abs(value1.x - value2.x) > 1 || Math.abs(value1.y - value2.y) > 1) {
                        console.error(`baseLine ${key}错误test3`);
                        return
                    }
                    continue
                }
                const value1 = (answer[i] as any)[key]
                const value2 = (baseLine as any)[key]
                if (Math.abs(value1 - value2) > 1) {
                    console.error(`baseLine ${key}错误test3`);
                    return
                }
            }
        }
        console.log('baseLine test3 ✅');
    }

    // TODO: case异常
    const test4 = async () => {
        await loadFont()

        const data = {
            fontName: {
                family: "Play", style: "Regular", postscript: "Play-Regular"
            },
            textData: {
                characters: "twittle",
                characterStyleIDs: [0, 0, 0, 5, 5],
                styleOverrideTable: [
                    {
                        styleID: 5,
                        fontSize: 36
                    }
                ],
            },
            fontSize: 12,
        }
        const metrices = getMetrices(data, familyTokenize(data.textData))

        const baseLines = getBaseLine({
            w: 20,
            ...metrices,
            data
        })
        const answer = [
            {
                "position": {
                    "x": 0,
                    "y": 11.302000045776367
                },
                "width": 17.28515625,
                "lineY": 4.577636758540393e-8,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 0,
                "endCharacter": 3
            },
            {
                "position": {
                    "x": 0,
                    "y": 53.302001953125
                },
                "width": 13.921875,
                "lineY": 19.3960018157959,
                "lineHeight": 42,
                "lineAscent": 33,
                "firstCharacter": 3,
                "endCharacter": 4
            },
            {
                "position": {
                    "x": 0,
                    "y": 95.302001953125
                },
                "width": 16.91015625,
                "lineY": 61.39600372314453,
                "lineHeight": 42,
                "lineAscent": 33,
                "firstCharacter": 4,
                "endCharacter": 6
            },
            {
                "position": {
                    "x": 0,
                    "y": 109.302001953125
                },
                "width": 6.421875,
                "lineY": 98,
                "lineHeight": 14,
                "lineAscent": 11,
                "firstCharacter": 6,
                "endCharacter": 7
            }
        ]
        for (let i = 0; i < baseLines.length; i++) {
            const baseLine = baseLines[i];
            for (const key in baseLine) {
                if (key === 'position') {
                    const value1 = (answer[i] as any)[key]
                    const value2 = (baseLine as any)[key]
                    if (Math.abs(value1.x - value2.x) > 1 || Math.abs(value1.y - value2.y) > 1) {
                        console.error(`baseLine ${key}错误test4`);
                        return
                    }
                    continue
                }
                const value1 = (answer[i] as any)[key]
                const value2 = (baseLine as any)[key]
                if (Math.abs(value1 - value2) > 1) {
                    console.error(`baseLine ${key}错误test4`);
                    return
                }
            }
        }
        console.log('baseLine test4 ✅');
    }

    test1()
    test2()
    test3()

    // test4() // case异常
}