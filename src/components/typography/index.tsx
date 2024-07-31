import { InputNumber, Radio, RadioChangeEvent, Select, Slider, Tooltip } from "antd"
import { Editor, StyleInterface } from "../../rich-text"
import './index.css'
import { useEffect, useState } from "react"
import { fontListData } from './font-list'


type TypographyCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    updateRender: () => void
}



export const TypographyComp = (props: TypographyCompProps) => {
    const { editorRef, updateRender } = props
    const editor = editorRef.current!
    const editorStyle = editor.getStyle(true)

    const [family, setFamily] = useState(editorStyle.fontName!.family)
    const [style, setStyle] = useState(editorStyle.fontName!.style)
    const [fontSize, setFontSize] = useState(editorStyle.fontSize)
    const [textDecoration, setTextDecoration] = useState(editor.style.textDecoration)

    const fontOptions = fontListData.familyList.map(item => ({ label: item, value: item }))
    const styleOptions = fontListData.styleList[family]?.map(item => ({ label: item, value: item }))
    const fontSizeOptions = [12, 16, 20, 24, 32, 36, 40, 48].map(item => ({ label: item, value: item.toString() }))
    const variationAxes = fontListData.variationAxesList[`${family}#${style}`]

    const update = () => {
        editor?.deselection()
        editor?.clearCache()
        editor?.apply()
        updateRender()
    }

    const loadFontAsset = async (family: string, style: string) => {
        const asset = fontListData.assetList[`${family}#${style}`]
        if (asset) {
            const fontData = await (await fetch(asset)).arrayBuffer()
            editor?.fontMgrFromData([fontData])
        }
    }

    const handleFamilyChange = async (family: string) => {
        const style = fontListData.styleList[family]?.[0]
        const postscript = fontListData.postscriptList[`${family}#${style}`]
        if (!style || !postscript) return
        await loadFontAsset(family, style ?? '')
        const font = editor?.getFont(family, style)
        if (!font) {
            console.warn("切换查找字体失败")
            return
        }
        editor?.setStyle({
            fontName: {
                family,
                style,
                postscript
            },
        })
        update()
        setFamily(family)
        setStyle(style)
    }

    const handleStyleChange = async (style: string) => {
        const postscript = fontListData.postscriptList[`${family}#${style}`]
        if (!style || !postscript) return
        await loadFontAsset(family, style ?? '')
        const font = editor?.getFont(family, style)
        if (!font) {
            console.warn("切换查找字体样式失败")
            return
        }
        editor?.setStyle({
            fontName: {
                family,
                style,
                postscript
            },
        })
        update()
        setFamily(family)
        setStyle(style)
    }

    const handleFontSizeChange = (size: string) => {
        if (!size) return;
        setFontSize(parseInt(size, 10))
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

    const handleTextDecorationChange = (e: RadioChangeEvent) => {
        setTextDecoration(e.target.value)
        editor?.setStyle({
            textDecoration: e.target.value
        })
        update()
    }

    const handleTextCaseChange = (e: RadioChangeEvent) => {
        editor?.setStyle({
            textCase: e.target.value
        })
        update()
    }

    const changeVariationAxes = (val: number | null, name: string) => {
        if (val === null) return;
        const fontVariations = editor?.style?.fontVariations
        if (!fontVariations?.length) {
            const variations = variationAxes.map(item => {
                let value = item.value
                if (item.name === name) {
                    value = val
                }
                return {
                    axisName: item.name,
                    value
                }
            })
            editor?.setStyle({
                fontVariations: variations
            })
            update()
            return
        }
        const variation = fontVariations.find(item => item.axisName === name)
        if (!variation) {
            console.warn('changeVariationAxes exception')
            return;
        }
        variation.value = val
        editor?.setStyle({
            fontVariations
        })
        update()
    }

    const showVariationAxes = () => {
        if (!variationAxes?.length) return <></>
        return variationAxes.map(item => {
            const value = editor?.style.fontVariations.find(font => font.axisName === item.name)?.value ?? item.value
            if (item.name === "Width") {
                return <div key={"width"}>
                    <div className="typography-row">
                        <span>字宽</span>
                        <InputNumber size="small" min={item.min} max={item.max} value={value} onChange={(val) => changeVariationAxes(val, 'Width')} />
                    </div>
                    <Slider min={item.min} max={item.max} value={value} onChange={(val) => changeVariationAxes(val, 'Width')} />
                </div>
            }
            if (item.name === "Weight") {
                return <div key={"Weight"}>
                    <div className="typography-row" >
                        <span>字重</span>
                        <InputNumber size="small" min={item.min} max={item.max} value={value} onChange={(val) => changeVariationAxes(val, 'Weight')} />
                    </div>
                    <Slider min={item.min} max={item.max} value={value} onChange={(val) => changeVariationAxes(val, 'Weight')} />
                </div>
            }
            return <></>
        })
    }

    useEffect(() => {
        const watchSelection = () => {
            const style = editorRef.current?.getStyle()
            if (style?.fontName?.family) setFamily(style.fontName.family)
            if (style?.fontName?.style) setStyle(style.fontName.style)
            if (style?.fontSize) setFontSize(style.fontSize)
            if (style?.textDecoration) setTextDecoration(style.textDecoration)
            requestAnimationFrame(watchSelection)
        }
        requestAnimationFrame(watchSelection)
    }, [])


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
                value={fontSize.toString()}
                style={{ width: 110 }}
                onChange={handleFontSizeChange}
                options={fontSizeOptions}
            />
        </div>
        {showVariationAxes()}
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
        <div className="typography-row">
            <span>文本修饰</span>
            <div>
                <Radio.Group buttonStyle="solid" value={textDecoration ?? "NONE"} onChange={handleTextDecorationChange}>
                    <Tooltip placement="bottom" title={"无"} mouseEnterDelay={1}>
                        <Radio.Button value="NONE" style={{ height: 24, padding: 0 }} >
                            <span className="typography-icon">
                                <svg width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" stroke="none" d="M10 9H6V8h4v1z"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"下划线"} mouseEnterDelay={1}>
                        <Radio.Button value="UNDERLINE" style={{ height: 24, padding: 0 }}>
                            <span className="typography-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(6 6)" fill="currentColor" fillRule="evenodd" stroke="none" d="M3 5.5V0H2v5.5C2 7.433 3.567 9 5.5 9 7.433 9 9 7.433 9 5.5V0H8v5.5C8 6.88 6.88 8 5.5 8 4.12 8 3 6.88 3 5.5zM0 12h12v-1H0v1z"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"删除线"} mouseEnterDelay={1}>
                        <Radio.Button value="STRIKETHROUGH" style={{ height: 24, padding: 0 }}>
                            <span className="typography-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(6 6)" fill="currentColor" fillOpacity="1" fillRule="evenodd" stroke="none" d="M3.904 1.297C4.556.77 5.428.5 6.349.5c.907 0 1.756.228 2.407.742.661.523 1.069 1.301 1.149 2.295l-.997.08c-.06-.75-.353-1.26-.772-1.59C7.707 1.69 7.097 1.5 6.349 1.5c-.735 0-1.373.215-1.816.574-.434.352-.703.855-.703 1.503 0 .615.285 1.013.639 1.292.06.048.122.091.184.131h-1.41c-.246-.373-.413-.842-.413-1.423 0-.96.412-1.745 1.074-2.28zM8.824 8h1.069c.069.24.107.507.107.801 0 .972-.373 1.793-1.065 2.361-.68.56-1.622.838-2.707.838-1.1 0-1.986-.31-2.628-.879-.64-.567-.99-1.347-1.096-2.2l.992-.124c.083.66.343 1.2.767 1.575.422.374 1.055.628 1.965.628.925 0 1.619-.237 2.072-.61.442-.363.7-.891.7-1.589 0-.324-.066-.586-.177-.801zM0 7h12V6H0v1z"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                </Radio.Group>
            </div>
        </div>
        <div className="typography-row">
            <span>大小写</span>
            <div>
                <Radio.Group buttonStyle="solid" value={editor?.style.textCase ?? "NONE"} onChange={handleTextCaseChange}>
                    <Tooltip placement="bottom" title={"无"} mouseEnterDelay={1}>
                        <Radio.Button value="NONE" style={{ height: 24, padding: 0 }} >
                            <span className="typography-icon">
                                <svg width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" stroke="none" d="M10 9H6V8h4v1z"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"大写"} mouseEnterDelay={1}>
                        <Radio.Button value="UPPER" style={{ height: 24, padding: 0 }}>
                            <span className="typography-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(4 4)" fill="currentColor" fillRule="nonzero" stroke="none" d="m1.356 12.5.878-2.472h3.528L6.64 12.5h1.108L4.544 3.773H3.453L.248 12.5h1.108zm1.21-3.41 1.398-3.937h.068L5.43 9.091H2.566zM14.663 6.5h1.091c-.324-1.688-1.738-2.847-3.58-2.847-2.236 0-3.817 1.722-3.817 4.483 0 2.762 1.568 4.483 3.886 4.483 2.08 0 3.562-1.385 3.562-3.545v-.938h-3.323v.938h2.3c-.03 1.568-1.06 2.557-2.54 2.557-1.618 0-2.863-1.228-2.863-3.495 0-2.267 1.245-3.494 2.796-3.494 1.261 0 2.118.712 2.488 1.858z"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"小写"} mouseEnterDelay={1}>
                        <Radio.Button value="LOWER" style={{ height: 24, padding: 0 }}>
                            <span className="typography-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(4 4)" fill="currentColor" fillOpacity="1" fillRule="nonzero" stroke="none" d="M3.81 12.653c1.142 0 1.738-.613 1.943-1.04h.05v.887H6.81V8.187c0-2.079-1.585-2.318-2.42-2.318-.989 0-2.114.341-2.625 1.534l.955.341c.221-.477.745-.988 1.704-.988.925 0 1.38.49 1.38 1.33v.033c0 .486-.494.444-1.687.597-1.214.158-2.54.426-2.54 1.926 0 1.279.99 2.011 2.233 2.011zm.153-.903c-.801 0-1.38-.358-1.38-1.057 0-.767.698-1.005 1.482-1.108.426-.05 1.568-.17 1.739-.375v.92c0 .819-.648 1.62-1.841 1.62zm7.324 3.34c1.568 0 2.83-.715 2.83-2.402V5.955h-.972v1.04h-.102c-.222-.342-.63-1.126-1.91-1.126-1.653 0-2.795 1.313-2.795 3.324 0 2.046 1.193 3.205 2.779 3.205 1.278 0 1.687-.75 1.909-1.108h.085v1.33c0 1.09-.767 1.585-1.824 1.585-1.189 0-1.606-.627-1.875-.99l-.801.563c.41.686 1.214 1.313 2.676 1.313zm-.034-3.596c-1.261 0-1.91-.954-1.91-2.318 0-1.33.632-2.403 1.91-2.403 1.227 0 1.875.988 1.875 2.403 0 1.449-.665 2.318-1.875 2.318z"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip placement="bottom" title={"字首大写"} mouseEnterDelay={1}>
                        <Radio.Button value="TITLE" style={{ height: 24, padding: 0 }}>
                            <span className="typography-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(4 4)" fill="currentColor" fillOpacity="1" fillRule="nonzero" stroke="none" d="m1.954 12.5.878-2.472H6.36l.878 2.472h1.108L5.14 3.773H4.05L.845 12.5h1.108zm1.21-3.41 1.398-3.937h.068l1.398 3.938H3.164zm9.047 6c1.568 0 2.83-.715 2.83-2.402V5.955h-.972v1.04h-.102c-.222-.342-.631-1.126-1.91-1.126-1.653 0-2.795 1.313-2.795 3.324 0 2.046 1.193 3.205 2.778 3.205 1.279 0 1.688-.75 1.91-1.108h.085v1.33c0 1.09-.767 1.585-1.824 1.585-1.189 0-1.607-.627-1.875-.99l-.801.563c.409.686 1.214 1.313 2.676 1.313zm-.034-3.596c-1.261 0-1.91-.954-1.91-2.318 0-1.33.631-2.403 1.91-2.403 1.227 0 1.875.988 1.875 2.403 0 1.449-.665 2.318-1.875 2.318z"></path></svg>
                            </span>
                        </Radio.Button>
                    </Tooltip>
                </Radio.Group>
            </div>
        </div>
    </div>
}