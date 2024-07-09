import { describe, test, expect } from "bun:test";
import {
    familyTokenize,
    findClosestIndex,
    lineTokenize,
    splitLines,
    wordTokenize,
} from "../richText/helper";

describe("字符串分词", () => {
    test("test1", () => {
        const testString = "I'm a constant.  This is a test... 哈哈";
        expect(lineTokenize(testString)).toEqual([
            "I'm",
            " ",
            "a",
            " ",
            "constant.",
            "  ",
            "This",
            " ",
            "is",
            " ",
            "a",
            " ",
            "test...",
            " ",
            "哈",
            "哈",
        ]);
    });

    test("test2", () => {
        const testString = "Here's output@of a_typical   etc...";
        expect(lineTokenize(testString)).toEqual([
            "Here's",
            " ",
            "output@of",
            " ",
            "a_typical",
            "   ",
            "etc...",
        ]);
    });
});

describe("选区分词", () => {
    test("test1", () => {
        const testString = "Hello12   world!";
        expect(wordTokenize(testString)).toEqual(["Hello12", "   ", "world", "!"]);
    });

    test("test2", () => {
        const testString = "这是@#$^&! +-)(=# constant你好";
        expect(wordTokenize(testString)).toEqual([
            "这是",
            "@#$^&!",
            " ",
            "+-)(=#",
            " ",
            "constant你好",
        ]);
    });
});

describe("字体分组", () => {
    test("test1", () => {
        const textData = {
            characters: "twittle",
            characterStyleIDs: [0, 0, 0, 19, 19],
            styleOverrideTable: [
                {
                    styleID: 19,
                    fontName: {
                        family: "Source Sans Pro",
                        style: "Regular",
                        postscript: "SourceSansPro-Regular",
                    },
                },
            ],
        };
        expect(familyTokenize(textData)).toEqual(["twi", "tt", "le"]);
    });

    test("test2", () => {
        const textData = {
            characters: "twittle",
            characterStyleIDs: [19],
            styleOverrideTable: [
                {
                    styleID: 19,
                    fontName: {
                        family: "Source Sans Pro",
                        style: "Regular",
                        postscript: "SourceSansPro-Regular",
                    },
                },
            ],
        };
        expect(familyTokenize(textData)).toEqual(["t", "wittle"]);
    });

    test("test3", () => {
        const textData = {
            characters: "twittle",
        };
        expect(familyTokenize(textData)).toEqual(["twittle"]);
    });

    test("test4", () => {
        const textData = {
            characters: "twittle",
            characterStyleIDs: [19, 20],
            styleOverrideTable: [
                {
                    styleID: 19,
                    fontName: {
                        family: "Source Sans Pro",
                        style: "Regular",
                        postscript: "SourceSansPro-Regular",
                    },
                },
                {
                    styleID: 20,
                    fontName: { family: "Play", style: "Regular", postscript: "Play" },
                },
            ],
        };
        expect(familyTokenize(textData)).toEqual(["t", "w", "ittle"]);
    });
});

// fontkit 获取字体名称异常，无法用这种方式测试
// describe("字符前进宽度", () => {
//     test("test1", async () => {
//         // 加载字体
//         const localFilePath = new URL('../src/assets/Play-Regular.ttf', import.meta.url);
//         const localFilePath2 = new URL('../src/assets/SourceSansPro-Regular.otf', import.meta.url);
//         const data1 = await (await fetch(localFilePath)).arrayBuffer()
//         const data2 = await (await fetch(localFilePath2)).arrayBuffer()
//         FontMgr.FontMgrFromData(data1, data2)
//         const data = {
//             fontName: {
//                 family: "Play", style: "Regular", postscript: "Play-Regular"
//             },
//             textData: {
//                 characters: "twittle",
//                 characterStyleIDs: [0, 0, 0, 5, 5],
//                 styleOverrideTable: [{
//                     "styleID": 5,
//                     "fontSize": 36
//                 }],
//             },
//             fontSize: 12,
//         }
//         const result = getXAdvance(data, familyTokenize(data.textData)).map(i => i.toFixed(1))
//         const answer = [0, 4.828125, 14.33203125, 17.28515625, 30.6796875, 45.1640625, 48.1171875].map(i => i.toFixed(1))
//         expect(result).toEqual(answer);
//     });
// });

describe("字符宽度列表分行", () => {
    test("test1", () => {
        const wList = [4.824, 9.504, 2.952, 14.472, 14.472, 2.952, 6.42];
        const maxWidth = 30;
        const result = splitLines(wList, maxWidth);
        expect(result).toEqual([
            [4.824, 9.504, 2.952],
            [14.472, 14.472],
            [2.952, 6.42],
        ]);
    });
    test("test2", () => {
        const wList = [4.824, 9.504, 2.952, 14.472, 14.472, 2.952, 6.42];
        const maxWidth = 40;
        const result = splitLines(wList, maxWidth);
        expect(result).toEqual([
            [4.824, 9.504, 2.952, 14.472],
            [14.472, 2.952, 6.42],
        ]);
    });
    test("test3", () => {
        const wList = [4.824, 9.504, 2.952, 14.472, 14.472, 2.952, 6.42];
        const maxWidth = 2;
        const result = splitLines(wList, maxWidth);
        expect(result).toEqual([[4.824], [9.504], [2.952], [14.472], [14.472], [2.952], [6.42]]);
    });
});


describe("工具函数测试", () => {
    test("findClosestIndex", () => {
        const nums = [2, 5, 6, 7, 8, 8.5, 9];
        const idx1 = findClosestIndex(nums, 7.1)
        expect(idx1).toEqual(3)
        const idx2 = findClosestIndex(nums, 100)
        expect(idx2).toEqual(6)
        const idx3 = findClosestIndex(nums, -100)
        expect(idx3).toEqual(0)
    })
})
