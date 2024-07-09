import { Radio } from "antd"
import { AdjustLayout } from "./adjustLayout"
import { CANVAS_H, CANVAS_W } from "../utils"
import { Editor } from "../rich-text"
type AutoResizeCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    layout: (w?: number, h?: number) => void
}
export const AutoResizeComp = (props: AutoResizeCompProps) => {
    const { editorRef, layout } = props

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

    return <div>
        <Radio.Group value={editorRef.current?.style.textAutoResize} onChange={handleChange}>
            <Radio.Button value="WIDTH_AND_HEIGHT">自动宽度</Radio.Button>
            <Radio.Button value="HEIGHT">自动高度</Radio.Button>
            <Radio.Button value="NONE">固定宽高</Radio.Button>
        </Radio.Group>
        <div style={{ width: 600 }}>
            <AdjustLayout
                show={editorRef.current?.style.textAutoResize !== 'WIDTH_AND_HEIGHT'}
                title='调整文本框宽度'
                value={Math.round(editorRef.current?.width ?? 0)}
                max={CANVAS_W - 40}
                onChange={val => {
                    if (editorRef.current?.style.textAutoResize === 'NONE') {
                        layout(val, editorRef.current?.height ?? 0)
                        return
                    }
                    layout(val)
                }} />
            <AdjustLayout
                show={editorRef.current?.style.textAutoResize === 'NONE'}
                title='调整文本框高度'
                value={Math.round(editorRef.current?.height ?? 0)}
                max={CANVAS_H - 40}
                onChange={val => {
                    layout(editorRef.current?.width ?? 0, val)
                }} />
        </div>
    </div>
}