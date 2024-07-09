import FontMgr from "../richText/fontMgr";
import { getMetrices, familyTokenize } from "../richText/helper";
import PlayRegular from '../assets/Play-Regular.ttf'
import SourceSansProRegular from '../assets/SourceSansPro-Regular.otf'
import ResidentEvil from '../assets/resident_evil_7.otf'

// 加载字体数据
export const loadFont = async () => {
    const data1 = await (await fetch(PlayRegular)).arrayBuffer()
    const data2 = await (await fetch(SourceSansProRegular)).arrayBuffer()
    const data3 = await (await fetch(ResidentEvil)).arrayBuffer()
    FontMgr.FontMgrFromData(data1, data2, data3)
}

export const testAdvance = () => {
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
                        "styleID": 5,
                        "fontSize": 36
                    }
                ],
            },
            fontSize: 12,
        }
        const { xAdvances } = getMetrices(data, familyTokenize(data.textData))

        const arr = [0]
        for (let i = 0; i < xAdvances.length - 1; i++) {
            arr.push(xAdvances[i] + arr[arr.length - 1])
        }
        const answer = [0, 4.828125, 14.33203125, 17.28515625, 30.6796875, 45.1640625, 48.1171875]
        for (let i = 0; i < xAdvances.length; i++) {
            if (Math.abs(arr[i] - answer[i]) > 1) {
                console.error('xAdvances test1');
                return
            }
        }
        console.log('xAdvances test1 ✅');
    }
    const test2 = async () => {
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
                        fontName: {
                            family: "Resident Evil 7", style: "Regular", postscript: "ResidentEvil7"
                        },
                    }
                ],
            },
            fontSize: 12,
        }
        const { xAdvances } = getMetrices(data, familyTokenize(data.textData))
        const arr = [0]
        for (let i = 0; i < xAdvances.length - 1; i++) {
            arr.push(xAdvances[i] + arr[arr.length - 1])
        }
        const answer = [0, 4.828125, 14.33203125, 17.28515625, 19.60546875, 21.92578125, 24.87890625]
        for (let i = 0; i < xAdvances.length; i++) {
            if (Math.abs(arr[i] - answer[i]) > 1) {
                console.error('xAdvances test2');
                return
            }
        }
        console.log('xAdvances test2 ✅');
    }
    test1()
    test2()
}
