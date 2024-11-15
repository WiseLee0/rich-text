import { Button } from "antd"
import { deepClone, deepEqual, Editor, FillPaintType } from "../../rich-text"
import { FillItemComp } from "./fill-item"
import './index.css'
import { useEffect, useReducer, useState } from "react"

type FillsCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
}
export const FillsComp = (props: FillsCompProps) => {
    const { editorRef } = props
    const editor = editorRef.current!;

    const [, updateRender] = useReducer(i => i + 1, 0)
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
                fillPaints: [fill]
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

    const watchSelection = () => {
        const style = editorRef.current?.getStyleForSelection() as any

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
    }

    useEffect(() => {

        editorRef.current?.addEventListener('selection', watchSelection)
        editorRef.current?.addEventListener('setStyle', watchSelection)
        editorRef.current?.addEventListener('layout', watchSelection)
        return () => {
            editorRef.current?.removeEventListener('selection', watchSelection)
            editorRef.current?.removeEventListener('setStyle', watchSelection)
            editorRef.current?.removeEventListener('layout', watchSelection)
        }
    }, [fillPaints])

    return <div className="fills-container">
        <div className="fills-head">
            <span className="title">填充</span>
            <Button onClick={addFillPaint} type="text" size="small" icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12 6.5v11M6.5 12h11"></path></svg>} />
        </div>
        {isFillMix && <span style={{ fontSize: 12, color: '#0000004d' }}>点击 + 进行重置混合样式</span>}
        {!isFillMix && fillPaints.map((_item, idx) => {
            const fillIdx = fillPaints.length - 1 - idx
            return <FillItemComp editorRef={editorRef} fillPaints={fillPaints} fillIdx={fillIdx} key={Math.random().toString()} removeFillPaint={() => { removeFillPaint(fillIdx) }} />
        })}
    </div>
}