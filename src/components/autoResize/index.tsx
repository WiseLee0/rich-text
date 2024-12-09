import { InputNumber, Radio, Space, Tooltip } from "antd"
import { Editor } from "../../rich-text"
import './index.css'
import { useEffect, useReducer } from "react"

type AutoResizeCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    updateRender: () => void
}
export const AutoResizeComp = (props: AutoResizeCompProps) => {
    const { editorRef } = props
    const [, updateRender] = useReducer(i => i + 1, 0)

    useEffect(() => {
        const update = () => {
            updateRender()
        }
        editorRef.current?.addEventListener('layout', update)
        return () => {
            editorRef.current?.removeEventListener('layout', update)
        }
    }, [])

    const layout = (w?: number, h?: number) => {
        const editor = editorRef.current;
        editor?.deselection()
        editor?.layout(w, h)
    }

    const handleChange = (e: any) => {
        if (e.target.value === 'WIDTH_AND_HEIGHT') {
            layout()
        }
        if (e.target.value === 'HEIGHT') {
            layout(editorRef.current?.width)
        }
        if (e.target.value === 'NONE') {
            layout(editorRef.current?.width, editorRef.current?.height)
        }
    }
    const textAutoResize = editorRef.current?.style.textAutoResize

    return <div className="autoresieze-container">
        <span className="title">布局</span>
        <div className="autoresieze-wh">
            <Space>
                <InputNumber
                    min={0}
                    addonBefore="W"
                    onChange={val => {
                        if (!val) return;
                        if (editorRef.current?.style.textAutoResize === 'NONE') {
                            layout(val, editorRef.current?.height ?? 0)
                            return
                        }
                        layout(val)
                    }}
                    size="small"
                    value={Math.round(editorRef.current?.width ?? 0)}
                    disabled={textAutoResize === 'WIDTH_AND_HEIGHT'} />
                <InputNumber
                    min={0}
                    onChange={val => {
                        if (!val) return;
                        layout(editorRef.current?.width ?? 0, val)
                    }}
                    addonBefore="H" size="small"
                    value={Math.round(editorRef.current?.height ?? 0)}
                    disabled={textAutoResize !== 'NONE'} />
            </Space>
        </div>
        <div className="autoresieze-adjust">
            <Radio.Group value={textAutoResize} buttonStyle="solid" onChange={handleChange} >
                <Tooltip placement="bottom" title={"自动宽度"} mouseEnterDelay={1}>
                    <Radio.Button value="WIDTH_AND_HEIGHT" style={{ height: 24, width: 80 }} >
                        <span className="autoresieze-icon">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M14.146 8.146a.5.5 0 0 1 .707 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.707-.708L16.293 12H7.707l2.146 2.147a.5.5 0 1 1-.707.707l-3-3a.5.5 0 0 1 0-.707l3-3a.5.5 0 0 1 .707.707L7.707 11h8.586l-2.147-2.146a.5.5 0 0 1 0-.708Z" clipRule="evenodd"></path></svg>
                        </span>
                    </Radio.Button>
                </Tooltip>
                <Tooltip placement="bottom" title={"自动高度"} mouseEnterDelay={1}>
                    <Radio.Button value="HEIGHT" style={{ height: 24, width: 80 }}>
                        <span className="autoresieze-icon">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M5 7.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5Zm0 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5Zm.5-4.5a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1h-13Z" clipRule="evenodd"></path></svg>
                        </span>
                    </Radio.Button>
                </Tooltip>
                <Tooltip placement="bottom" title={"固定大小"} mouseEnterDelay={1}>
                    <Radio.Button value="NONE" style={{ height: 24, width: 80 }}>
                        <span className="autoresieze-icon">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M17 7H7v10h10V7ZM7 6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7Z" clipRule="evenodd"></path></svg>
                        </span>
                    </Radio.Button>
                </Tooltip>
            </Radio.Group>
        </div>
    </div>
}
