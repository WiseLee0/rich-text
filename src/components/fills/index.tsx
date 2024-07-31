import { Button } from "antd"
import { Editor, FillPaintType } from "../../rich-text"
import { FillItemComp } from "./fill-item"
import './index.css'

type FillsCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    updateRender: () => void
}
export const FillsComp = (props: FillsCompProps) => {
    const { editorRef, updateRender } = props
    const editor = editorRef.current!;

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
        if (!editor.style.fillPaints.length) { editor.style.fillPaints = [fill] }
        else {
            editor.style.fillPaints.push(fill)
        }
        updateRender()
    }

    const removeFillPaint = (idx: number) => {
        editor.style.fillPaints.splice(idx, 1)
        updateRender()
    }

    return <div className="fills-container">
        <div className="fills-head">
            <span className="title">填充</span>
            <Button onClick={addFillPaint} type="text" size="small" icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12 6.5v11M6.5 12h11"></path></svg>} />
        </div>
        {editor.style.fillPaints.map((_item, idx) => {
            const fillIdx = editor.style.fillPaints.length - idx - 1
            return <FillItemComp data={editor.style.fillPaints[fillIdx]} key={fillIdx.toString()} removeFillPaint={() => { removeFillPaint(idx) }} />
        })}
    </div>
}