import { getBaseLine } from "./baseLine";
import { getGlyphs } from "./glyphs";
import { getMetrices, familyTokenize, findClosestIndex } from "./helper";
import RichSelection from "./selection";
import type { RichTextInfo, TextDataInfo, derivedTextDataInfo, FontNameInfo, MetricesInfo } from "./type";

class RichTextStore {
    private textData: TextDataInfo = {} as any
    private derivedTextData: derivedTextDataInfo = {
        layoutSize: {
            x: 0,
            y: 0
        }
    } as any
    private fontName: FontNameInfo = {} as any
    private fontSize: number = 12
    private metrices: MetricesInfo = {} as any

    /** 属性设置和访问 */
    setFontName(fontName: FontNameInfo) {
        this.fontName = fontName
    }
    setFontSize(fontSize: number) {
        this.fontSize = fontSize
    }
    getData() {
        return {
            fontSize: this.fontSize,
            fontName: this.fontName,
            textData: this.textData,
            derivedTextData: this.derivedTextData
        } as RichTextInfo
    }
    setData(info: Partial<RichTextInfo>) {
        if (info.fontName) this.fontName = info.fontName
        if (info.fontSize) this.fontSize = info.fontSize
        if (info.textData) this.textData = info.textData
        if (info.derivedTextData) this.derivedTextData = info.derivedTextData
    }
    setLayoutSize(x: number, y: number) {
        this.derivedTextData.layoutSize.x = x
        this.derivedTextData.layoutSize.y = y
    }
    setLayoutSizeX(x: number) {
        this.derivedTextData.layoutSize.x = x
    }
    setLayoutSizeY(y: number) {
        this.derivedTextData.layoutSize.y = y
    }
    setCharacters(characters: string) {
        this.textData.characters = characters
    }
    get characters() {
        return this.textData.characters
    }

    /** 属性方法 */
    layout() {
        this.calcDerivedTextData()
        return this.getData()
    }
    // 计算布局数据
    calcDerivedTextData() {
        const data = this.getData()
        const metrices = getMetrices(data, familyTokenize(data.textData))
        const baselines = getBaseLine({
            w: data.derivedTextData.layoutSize.x,
            ...metrices,
            data
        })
        const glyphs = getGlyphs({
            baselines,
            metrices
        })
        this.derivedTextData.baselines = baselines
        this.derivedTextData.glyphs = glyphs
        this.metrices = metrices
    }
    // 计算字符选区下标
    calcSelectionCollapse(x: number, y: number) {
        const data = RichText.getData()
        const { glyphs, baselines } = data.derivedTextData
        if (!baselines) return [-1, -1];

        // 找到最近的Y
        let yIdx = baselines?.findIndex(item => item.lineY > y)
        if (yIdx === -1) yIdx = baselines.length - 1
        else if (yIdx === 0) yIdx = 0
        else yIdx -= 1

        // 获取最近Y的行
        const { firstCharacter, endCharacter, width, position } = baselines[yIdx]
        const xArr = glyphs.slice(firstCharacter, endCharacter).map(item => item.position.x)
        xArr.push(position.x + width)

        // 找到最近的X
        const xIdx = findClosestIndex(xArr, x)

        return [yIdx, xIdx]
    }
    // 更新选区下标
    updateSelectionRange() {
        if (!RichSelection.hasRange) return
        const data = RichText.getData()
        const { baselines } = data.derivedTextData
        if (!baselines) return
        if (RichSelection.isCollapse) {
            const [yIdx, xIdx] = RichSelection.focus
            let modifyY = yIdx
            let modifyX = xIdx
            const { firstCharacter, endCharacter } = baselines[yIdx]
            const offset = firstCharacter + xIdx
            if (offset >= endCharacter || offset < firstCharacter) {
                modifyY = baselines.findIndex(item => item.firstCharacter <= offset && item.endCharacter > offset)
                if (modifyY === -1) {
                    modifyY = offset > 0 ? baselines.length - 1 : 0
                    modifyX = offset > 0 ? baselines[modifyY].endCharacter - baselines[modifyY].firstCharacter : 0
                } else {
                    modifyX = offset - baselines[modifyY].firstCharacter
                }
                RichSelection.setRange([modifyY, modifyX], [modifyY, modifyX])
            }
        }
    }
    // 获取字符下标
    getSelectionOffset() {
        const { baselines } = this.derivedTextData
        const anchor = baselines[RichSelection.anchor[0]]?.firstCharacter + RichSelection.anchor[1]
        const focus = baselines[RichSelection.focus[0]]?.firstCharacter + RichSelection.focus[1]
        return [anchor, focus]
    }
}
const RichText = new RichTextStore()
export default RichText;