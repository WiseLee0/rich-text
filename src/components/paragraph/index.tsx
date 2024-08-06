import { InputNumber, Radio, RadioChangeEvent } from "antd"
import { Editor, StyleInterface } from "../../rich-text"
import './index.css'
import { useEffect, useState } from "react"

type ParagraphCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
}
export const ParagraphComp = (props: ParagraphCompProps) => {
    const { editorRef } = props
    const editor = editorRef.current!
    const [maxLine, setMaxLine] = useState(editor.style.maxLines)
    const [textTruncation, setTextTruncation] = useState(editor.style.textTruncation)
    const { textAutoResize } = editor.style
    const disableMaxLine = textAutoResize === 'NONE'

    const handleMaxLineChange = (value: number | null) => {
        if (!value) return
        setMaxLine(value)
        editor.setStyle({
            maxLines: value
        })
        editor?.apply()
    }

    const handleTextTruncationChange = (e: RadioChangeEvent) => {
        setTextTruncation(e.target.value)
        editor?.setStyle({
            textTruncation: e.target.value as StyleInterface['textTruncation']
        })
        editor?.apply()
    }

    useEffect(() => {
        const watchSelection = () => {
            const style = editorRef.current?.getStyleForSelection()
            if (style?.maxLines) setMaxLine(style.maxLines)
            if (style?.textTruncation) setTextTruncation(style.textTruncation)
        }
        editorRef.current?.addEventListener('selection', watchSelection)
        return () => {
            editorRef.current?.removeEventListener('selection', watchSelection)
        }
    }, [])

    return <div className="paragraph-container">
        <span className="title">段落排印</span>
        <div className="paragraph-row">
            <span>截断文本</span>
            <Radio.Group buttonStyle="solid" value={textTruncation} onChange={handleTextTruncationChange}>
                <Radio.Button value="DISABLE" style={{ height: 24, padding: 0 }} >
                    <span className="opentype-icon">
                        <svg width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" stroke="none" d="M10 9H6V8h4v1z"></path></svg>
                    </span>
                </Radio.Button>
                <Radio.Button value="ENABLE" style={{ height: 24, padding: 0 }} >
                    <span className="opentype-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(4 4)" fill="currentColor" fillOpacity=".9" fillRule="nonzero" stroke="none" d="M1.179 12H.256l2.67-7.273h.91L6.505 12h-.924L3.41 5.878h-.057L1.18 12zm.34-2.84h3.722v.78H1.52v-.78zm6.942 2.908c-.21 0-.39-.075-.541-.226-.15-.15-.226-.33-.226-.54 0-.211.075-.391.226-.542.15-.15.331-.226.541-.226.21 0 .39.075.541.226.151.15.226.33.226.541 0 .14-.035.267-.106.384-.068.116-.16.21-.277.28-.114.07-.242.103-.384.103zm3.365 0c-.21 0-.39-.075-.541-.226-.15-.15-.226-.33-.226-.54 0-.211.075-.391.226-.542.15-.15.33-.226.54-.226.211 0 .392.075.542.226.15.15.226.33.226.541 0 .14-.036.267-.107.384-.068.116-.16.21-.277.28-.113.07-.241.103-.383.103zm3.365 0c-.21 0-.391-.075-.542-.226-.15-.15-.225-.33-.225-.54 0-.211.075-.391.225-.542.151-.15.331-.226.542-.226.21 0 .39.075.54.226.151.15.227.33.227.541 0 .14-.036.267-.107.384-.068.116-.16.21-.277.28-.114.07-.241.103-.383.103z"></path></svg>
                    </span>
                </Radio.Button>
            </Radio.Group>
        </div>
        {!disableMaxLine && <div className="paragraph-row">
            <span>最大行数</span>
            <InputNumber
                style={{ width: 70 }}
                min={0}
                onChange={handleMaxLineChange}
                size="small"
                value={maxLine}
            />
        </div>}
    </div>
}