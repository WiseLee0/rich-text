import { Button } from "antd"
import { deepClone, deepEqual, Editor, FillPaintType } from "../../rich-text"
import { FillItemComp } from "./fill-item"
import './index.css'
import { useEffect, useState } from "react"

type FillsCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    updateRender: () => void
}
export const FillsComp = (props: FillsCompProps) => {
    const { editorRef, updateRender } = props
    const editor = editorRef.current!;
    const [fillPaints, setFillPaints] = useState<FillPaintType[]>(deepClone(editor.style.fillPaints))
    const [isFillMix, setIsFillMix] = useState(false)

    const addFillPaint = () => {
        const fill = {
            "type": "SOLID",
            "color": {
                "r": 0,
                "g": 0,
                "b": 0,
                "a": 1
            },
            "opacity": 0.2,
            "visible": true,
            "blendMode": "NORMAL"
        } as FillPaintType

        if (!fillPaints.length || isFillMix) {
            editor.setStyle({
                fillPaints: deepClone(editor.style.fillPaints)
            })
        } else {
            fillPaints.push(fill)
            editor.setStyle({
                fillPaints: deepClone(fillPaints as FillPaintType[])
            })
        }
        updateRender()
    }

    const removeFillPaint = (idx: number) => {
        fillPaints.splice(idx, 1)
        editor.setStyle({
            fillPaints: deepClone(fillPaints as FillPaintType[])
        })
        updateRender()
    }

    useEffect(() => {
        let handle: number
        const watchSelection = () => {
            const style = editorRef.current?.getStyle() as any
            if (style?.fillPaints) {
                if (style.fillPaints === 'mix') {
                    setIsFillMix(true)
                } else {
                    setIsFillMix(false)
                    if (!deepEqual(style?.fillPaints, fillPaints)) {
                        setFillPaints(deepClone(style?.fillPaints))
                    }
                }
            }
            handle = requestAnimationFrame(watchSelection)
        }
        handle = requestAnimationFrame(watchSelection)
        return () => {
            handle && cancelAnimationFrame(handle)
        }
    }, [setFillPaints, fillPaints])

    return <div className="fills-container">
        <div className="fills-head">
            <span className="title">填充</span>
            <Button onClick={addFillPaint} type="text" size="small" icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12 6.5v11M6.5 12h11"></path></svg>} />
        </div>
        {isFillMix && <span style={{ fontSize: 12, color: '#0000004d' }}>点击 + 进行重置混合样式</span>}
        {!isFillMix && fillPaints.map((_item, idx) => {
            const fillIdx = editor.style.fillPaints.length - idx - 1
            return <FillItemComp editorRef={editorRef} fillPaints={fillPaints} fillIdx={fillIdx} key={Math.random().toString()} removeFillPaint={() => { removeFillPaint(fillIdx) }} />
        })}
    </div>
}