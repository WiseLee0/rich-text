import { Radio, RadioChangeEvent, Select, Tooltip } from "antd"
import { Editor, StyleInterface } from "../../rich-text"
import './index.css'
import { useState } from "react"
import PlayRegularURL from "../../assets/Play-Regular.ttf?url";
import AnonymousProRegularURL from "../../assets/Anonymous_Pro/AnonymousPro-Regular.ttf?url";
import AnonymousProBoldURL from "../../assets/Anonymous_Pro/AnonymousPro-Bold.ttf?url";
import AnonymousProItalicURL from "../../assets/Anonymous_Pro/AnonymousPro-Italic.ttf?url";

type TypographyCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    updateRender: () => void
}

const fontList = [
    {
        family: "Play",
        styles: ["Regular"],
        assets: [PlayRegularURL]
    }, {
        family: "Anonymous Pro",
        styles: ["Regular", "Bold", "Italic"],
        assets: [AnonymousProRegularURL, AnonymousProBoldURL, AnonymousProItalicURL]
    }
]

export const TypographyComp = (props: TypographyCompProps) => {
    const { editorRef, updateRender } = props
    const editor = editorRef.current
    const [family, setFamily] = useState('Play')
    const [style, setStyle] = useState('Regular')

    const fontOptions = fontList.map(item => ({ label: item.family, value: item.family }))
    const styleOptions = fontList.find(item => item.family === family)?.styles.map(item => ({ label: item, value: item })) || []

    const fontSizeOptions = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 32, 36, 40, 48].map(item => ({ label: item, value: item.toString() }))

    const update = () => {
        editor?.clearCache()
        editor?.apply()
        updateRender()
    }

    const loadFontAsset = async (family: string, style: string) => {
        const fontIdx = fontList.findIndex(item => item.family === family)
        const styleIdx = fontList[fontIdx]?.styles.findIndex(item => item === style)
        if (styleIdx > -1) {
            const asset = fontList[fontIdx].assets[styleIdx];
            const fontData = await (await fetch(asset)).arrayBuffer()
            editor?.fontMgrFromData([fontData])
        }
    }

    const handleFamilyChange = async (family: string) => {
        setFamily(family)
        const style = fontList.find(item => item.family === family)?.styles[0]
        await loadFontAsset(family, style ?? '')
        const font = editor?.getFont(family, style)
        if (!font) return;
        editor?.setStyle({
            fontName: {
                family: font.familyName,
                style: font.subfamilyName,
                postscript: `${font.postscriptName}-${font.subfamilyName}`
            },
        })
        update()
    }

    const handleStyleChange = async (style: string) => {
        setStyle(style)
        await loadFontAsset(family ?? '', style)
        const font = editor?.getFont(family, style)
        if (!font) return;
        editor?.setStyle({
            fontName: {
                family: font.familyName,
                style: font.subfamilyName,
                postscript: `${font.postscriptName}-${font.subfamilyName}`
            },
        })
        update()
    }

    const handleFontSizeChange = (size: string) => {
        if (!size) return;
        editor?.setStyle({
            fontSize: parseInt(size, 10)
        })
        update()
    }

    const handleTextAlignHorizontalChange = (e: RadioChangeEvent) => {
        editor?.setStyle({
            textAlignHorizontal: e.target.value as StyleInterface['textAlignHorizontal']
        })
        update()
    }

    const handleTextAlignVerticalChange = (e: RadioChangeEvent) => {
        editor?.setStyle({
            textAlignVertical: e.target.value as StyleInterface['textAlignVertical']
        })
        update()
    }


    return <div className="typography-container">
        <span className="title">字体排版</span>
        <Select
            value={family}
            style={{ margin: '8px 0' }}
            onChange={handleFamilyChange}
            options={fontOptions}
        />
        <div className="typography-row" style={{ marginBottom: '8px' }}>
            <Select
                value={style}
                style={{ width: 110 }}
                onChange={handleStyleChange}
                options={styleOptions}
            />
            <Select
                value={editor?.style.fontSize.toString()}
                style={{ width: 110 }}
                onChange={handleFontSizeChange}
                options={fontSizeOptions}
            />
        </div>
        <div className="typography-row">
            <span>水平对齐</span>
            <div>
                <Radio.Group buttonStyle="solid" value={editor?.style.textAlignHorizontal} onChange={handleTextAlignHorizontalChange}>
                    <Tooltip placement="bottom" title={"左对齐"} mouseEnterDelay={1}>
                        <Radio.Button value="LEFT" style={{ height: 24, padding: 0 }} >
                            <span className="typography-icon">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M5 7.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5Zm0 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5Zm.5-4.5a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1h-13Z" clipRule="evenodd"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"居中对齐"} mouseEnterDelay={1}>
                        <Radio.Button value="CENTER" style={{ height: 24, padding: 0 }}>
                            <span className="typography-icon">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M5 7.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5Zm3 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5ZM7.5 15a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9Z" clipRule="evenodd"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"右对齐"} mouseEnterDelay={1}>
                        <Radio.Button value="RIGHT" style={{ height: 24, padding: 0 }}>
                            <span className="typography-icon">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M19 7.5a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0 0 1h13a.5.5 0 0 0 .5-.5Zm0 4a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5Zm-.5 3.5a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1h9Z" clipRule="evenodd"></path></svg>

                            </span>
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"两端对齐"} mouseEnterDelay={1}>
                        <Radio.Button value="JUSTIFIED" style={{ height: 24, padding: 0 }}>
                            <span className="typography-icon">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M5 7.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5Zm0 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5Z m.5-4.5a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1h-13Z" clipRule="evenodd"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                </Radio.Group>
            </div>
        </div>
        <div className="typography-row">
            <span>垂直对齐</span>
            <div>
                <Radio.Group buttonStyle="solid" value={editor?.style.textAlignVertical} onChange={handleTextAlignVerticalChange}>
                    <Tooltip placement="bottom" title={"上对齐"} mouseEnterDelay={1}>
                        <Radio.Button value="TOP" style={{ height: 24, padding: 0 }} >
                            <span className="typography-icon">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M5.5 5a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1h-12Zm6.354 2.146a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 .708.708L11 8.707V16.5a.5.5 0 0 0 1 0V8.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3Z" clipRule="evenodd"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"居中对齐"} mouseEnterDelay={1}>
                        <Radio.Button value="MIDDLE" style={{ height: 24, padding: 0 }}>
                            <span className="typography-icon">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m11.854 9.854 2-2a.5.5 0 0 0-.708-.708L12 8.293V4.5a.5.5 0 0 0-1 0v3.793L9.854 7.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0Zm0 3.292 2 2a.5.5 0 0 1-.708.708L12 14.707V18.5a.5.5 0 0 1-1 0v-3.793l-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0ZM5.5 11a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1h-12Z" clipRule="evenodd"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"下对齐"} mouseEnterDelay={1}>
                        <Radio.Button value="BOTTOM" style={{ height: 24, padding: 0 }}>
                            <span className="typography-icon">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m14.854 13.854-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L11 15.293V7.5a.5.5 0 0 1 1 0v7.793l2.146-2.147a.5.5 0 0 1 .708.708ZM5.5 19a.5.5 0 0 1 0-1h12a.5.5 0 0 1 0 1h-12Z" clipRule="evenodd"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                </Radio.Group>
            </div>
        </div>
    </div>
}