import { Editor, Font } from ".."
import { detect_text } from "../detect-lang/pkg/detect_lang"

export const lackFontTable = {
    'Mandarin': {
        url: 'https://static.figma.com/font/NotoSansSC-VF_1',
        fontFamily: 'Noto Sans SC'
    },
    'Japanese': {
        url: 'https://static.figma.com/font/NotoSansJP-VF_1',
        fontFamily: 'Noto Sans JP'
    },
    'Korean': {
        url: 'https://static.figma.com/font/NotoSansKR-VF_1',
        fontFamily: 'Noto Sans KR'
    },
    // 'Hindi': {
    //     url: 'https://fonts.gstatic.com/s/notosansdevanagari/v26/TuG7UUFzXI5FBtUq5a8bjKYTZjtRU6Sgv3NaV_SNmI0b8QQCQmHN5TV_5Kl4-GIB.woff2',
    //     fontFamily: 'Noto Sans Devanagari'
    // },
    // 'Thai': {
    //     url: 'https://fonts.gstatic.com/s/notosansthai/v25/iJWQBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcdfKI2hTWsb-P2c.woff2',
    //     fontFamily: 'Noto Sans Thai'
    // }
}

type OriginFontInfo = {
    originFont: Font
    fontStyle: string,
    fontVariations?: Record<string, number>
}

export const getLangFont = (editor: Editor, char: string, originFontInfo: OriginFontInfo) => {
    const lang = detect_text(char) as keyof typeof lackFontTable;
    let font = editor.fonMgr.get(lackFontTable[lang]?.fontFamily)?.[0]
    let url = lackFontTable[lang]?.url
    if (!font) return [font, url] as const;

    const { originFont, fontStyle } = originFontInfo
    // 如果原来字体是变体，则先尝试原字体变体设置
    let fontVariations = originFontInfo.fontVariations
    if (!fontVariations || !Object.keys(fontVariations).length) {
        const originVariations = (originFont as any)?.namedVariations?.[fontStyle]
        if ((originFont as any)?.namedVariations?.[fontStyle]) {
            fontVariations = originVariations
        }
    }

    const { variationAxes, namedVariations } = font as any;
    // 尝试进行适配变体配置
    if (variationAxes && fontVariations && Object.keys(fontVariations)?.length) {
        let matchVariations = true
        for (const key in fontVariations) {
            if (!variationAxes[key]) {
                matchVariations = false
                break
            }
            if (fontVariations[key] < variationAxes[key].min || fontVariations[key] > variationAxes[key].max) {
                matchVariations = false
                break
            }
        }
        if (matchVariations) {
            font = font?.getVariation(fontVariations)
            return [font, lang] as const
        }
    }

    // 最后尝试字体样式匹配
    if (namedVariations?.[fontStyle]) {
        const _font = font?.getVariation(fontStyle)
        // 防止getVariation函数异常
        if (_font.familyName === font.familyName) {
            font = _font
        }
    }
    return [font, url] as const
}

export const loadLangFont = (editor: Editor, url: string) => {
    if (!url) return
    fetch(url).then(async res => {
        const buffer = await res.arrayBuffer()
        editor.fontMgrFromData([buffer])
        editor.apply()
    })
}
