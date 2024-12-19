import { Input, InputNumber, Radio, RadioChangeEvent } from "antd"
import { Editor, StyleInterface } from "../../rich-text"
import './index.css'
import { useEffect, useState } from "react"

type ParagraphCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    updateRender: () => void
}
export const ParagraphComp = (props: ParagraphCompProps) => {
    const { editorRef, updateRender } = props
    const editor = editorRef.current!
    const [maxLine, setMaxLine] = useState(editor.style.maxLines)
    const [textTruncation, setTextTruncation] = useState(editor.style.textTruncation)
    const [leadingTrim, setLeadingTrim] = useState(editor.style.leadingTrim)
    const [listType, setTextListType] = useState(editor.getTextListTypeForSelection())
    const [paragraphSpacing, setParagraphSpacing] = useState(editor.getParagraphSpacing())
    const [paragraphIndent, setParagraphIndent] = useState(editor.style.paragraphIndent)
    const { textAutoResize } = editor.style
    const disableMaxLine = textAutoResize === 'NONE'

    const handleParagraphIndentChange = (value: number | null) => {
        if (value === null) return
        setParagraphIndent(value)
        editor.setStyle({
            paragraphIndent: value
        })
    }

    const handleParagraphSpacingChange = (e: any) => {
        const value = Number(e.target.value)
        if (!isNaN(value)) {
            setParagraphSpacing(value)
            editor.setParagraphSpacing(value)
        }
    }

    const handleMaxLineChange = (value: number | null) => {
        if (!value) return
        setMaxLine(value)
        editor.setStyle({
            maxLines: value
        })
    }

    const handleTextTruncationChange = (e: RadioChangeEvent) => {
        setTextTruncation(e.target.value)
        editor?.setStyle({
            textTruncation: e.target.value as StyleInterface['textTruncation']
        })
    }
    const handleLeadingTrimChange = (e: RadioChangeEvent) => {
        setLeadingTrim(e.target.value)
        editor?.setStyle({
            leadingTrim: e.target.value as StyleInterface['leadingTrim']
        })
        updateRender()
    }
    const handleTextListTypeChange = (e: RadioChangeEvent) => {
        setTextListType(e.target.value)
        editor.setTextList(e.target.value)
    }

    useEffect(() => {
        const watchSelection = () => {
            const listType = editor.getTextListTypeForSelection()
            if (listType) setTextListType(listType)
            const paragraphSpacing = editor.getParagraphSpacing()
            setParagraphSpacing(paragraphSpacing)
        }
        editorRef.current?.addEventListener('selection', watchSelection)
        return () => {
            editorRef.current?.removeEventListener('selection', watchSelection)
        }
    }, [])

    return <div className="paragraph-container">
        <span className="title">段落排印</span>
        <div className="paragraph-row">
            <span>列表样式</span>
            <Radio.Group value={listType} buttonStyle="solid" onChange={handleTextListTypeChange}>
                <Radio.Button value="PLAIN" style={{ height: 24, padding: 0 }} >
                    <span className="opentype-icon">
                        <svg width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" stroke="none" d="M10 9H6V8h4v1z"></path></svg>
                    </span>
                </Radio.Button>
                <Radio.Button value="UNORDERED_LIST" style={{ height: 24, padding: 0 }} >
                    <span className="opentype-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(4 4)" fill="currentColor" fillRule="evenodd" stroke="none" d="M4 2H2v1h2V2zm0 10H2v1h2v-1zM2 7h2v1H2V7zm12-5H6v1h8V2zM6 12h8v1H6v-1zm8-5H6v1h8V7z"></path></svg>
                    </span>
                </Radio.Button>
                <Radio.Button value="ORDERED_LIST" style={{ height: 24, padding: 0 }} >
                    <span className="opentype-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(4 4)" fill="currentColor" fillRule="nonzero" stroke="none" d="M2.837 1.636h-.752L1 2.333v.724l1.02-.652h.026V6h.79V1.636zM6 2h8v1H6V2zm0 10h8v1H6v-1zm8-5H6v1h8V7zm-9.947 6H1.062v-.571l1.515-1.485c.43-.437.652-.697.652-1.061 0-.412-.31-.665-.725-.665-.434 0-.716.279-.716.724h-.752c0-.829.614-1.365 1.479-1.365.878 0 1.472.534 1.472 1.265 0 .492-.234.889-1.082 1.703l-.752.764v.03h1.9V13z"></path></svg>
                    </span>
                </Radio.Button>
            </Radio.Group>
        </div>
        <div className="paragraph-row">
            <span>段落间距</span>
            <Input
                style={{ width: 70 }}
                onInput={handleParagraphSpacingChange}
                size="small"
                value={paragraphSpacing}
            />
        </div>
        <div className="paragraph-row">
            <span>段落缩进</span>
            <InputNumber
                style={{ width: 70 }}
                min={0}
                onChange={handleParagraphIndentChange}
                size="small"
                value={paragraphIndent}
            />
        </div>
        <div className="paragraph-row">
            <span>垂直裁剪</span>
            <Radio.Group buttonStyle="solid" value={leadingTrim} onChange={handleLeadingTrimChange}>
                <Radio.Button value="NONE" style={{ height: 24, padding: 0 }} >
                    <span className="opentype-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" transform="translate(4 4)" fillOpacity=".9" fillRule="nonzero" stroke="none" d="m3.385 10.62.64-1.803H6.6l.64 1.803h.81L5.71 4.253h-.795L2.576 10.62h.808zm.882-2.488 1.02-2.872h.05l1.02 2.873h-2.09zm6.601 4.378c1.144 0 2.065-.522 2.065-1.753V5.845h-.71v.759h-.074c-.161-.25-.46-.822-1.393-.822-1.206 0-2.04.958-2.04 2.425 0 1.493.871 2.339 2.027 2.339.934 0 1.232-.547 1.394-.809h.062v.97c0 .796-.56 1.157-1.33 1.157-.868 0-1.173-.457-1.369-.722l-.584.41c.298.501.886.959 1.952.959v-.001zm-.024-2.624c-.92 0-1.394-.696-1.394-1.691 0-.97.46-1.753 1.394-1.753.895 0 1.367.72 1.367 1.753 0 1.057-.485 1.691-1.367 1.691z"></path>
                            <path fill="currentColor" transform="translate(4 4)" fillOpacity=".9" fillRule="evenodd" stroke="none" d="M1 1.25h14V2H1v-.75zm0 13h14V15H1v-.75z"></path></svg>
                    </span>
                </Radio.Button>
                <Radio.Button value="CAP_HEIGHT" style={{ height: 24, padding: 0 }} >
                    <span className="opentype-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path transform="translate(4 4)" fill="currentColor" fillOpacity=".9" fillRule="nonzero" stroke="none" d="m3.316 11.617.64-1.803h2.575l.64 1.803h.809L5.64 5.25h-.794l-2.339 6.367h.809zM4.2 9.13l1.02-2.872h.05l1.02 2.873H4.2zm6.6 4.378c1.145 0 2.066-.522 2.066-1.752V6.841h-.71V7.6h-.074c-.162-.25-.46-.822-1.393-.822-1.206 0-2.04.958-2.04 2.426 0 1.492.87 2.338 2.027 2.338.933 0 1.232-.547 1.394-.808h.062v.97c0 .795-.56 1.156-1.331 1.156-.868 0-1.173-.457-1.368-.722l-.585.41c.299.501.886.959 1.953.959v-.001zm-.024-2.624c-.92 0-1.393-.696-1.393-1.69 0-.971.46-1.754 1.393-1.754.895 0 1.368.72 1.368 1.753 0 1.057-.485 1.691-1.368 1.691z"></path>
                            <path transform="translate(4 4)" fill="currentColor" fillOpacity=".9" fillRule="nonzero" stroke="none" d="M.625 3.625h14.75v.75H.625v-.75zm7.25 9.75H.625v-.75h7.25v.75zm5.75-.75h1.75v.75h-1.75v-.75z"></path></svg>
                    </span>
                </Radio.Button>
            </Radio.Group>
        </div>
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