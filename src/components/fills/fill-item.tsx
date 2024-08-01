import { Button, ColorPicker, InputNumber } from "antd";
import { useState } from "react";
import { deepClone, Editor, FillPaintType } from "../../rich-text";
import { hexToRgba, rgbaToHex } from "../../utils";

type FillItemCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    fillPaints: FillPaintType[]
    fillIdx: number
    removeFillPaint: () => void
}



export const FillItemComp = (props: FillItemCompProps) => {
    const { editorRef, fillPaints, fillIdx, removeFillPaint } = props
    const fillPaint = fillPaints[fillIdx]
    const hexColor = rgbaToHex(fillPaint.color.r, fillPaint.color.g, fillPaint.color.b, fillPaint.opacity)
    const [color, setColor] = useState(hexColor)
    const [visible, setVisible] = useState(fillPaint.visible)
    const alpha = color.length > 7 ? Math.round((parseInt(color.slice(-2), 16) / 255) * 100) : 100

    const updateFillPaints = () => {
        editorRef.current?.setStyle({
            fillPaints: deepClone(fillPaints)
        })
    }

    const changeVisible = () => {
        fillPaint.visible = !visible
        setVisible(!visible)
        updateFillPaints()
    }

    return <div className="fills-row">
        <div>
            <ColorPicker
                disabled={!visible}
                value={color}
                size="small"
                onChange={color => {
                    const colorHex = color.toHexString()
                    setColor(colorHex)
                    const rbga = hexToRgba(colorHex)
                    if (rbga) {
                        fillPaint.color.r = rbga.r
                        fillPaint.color.g = rbga.g
                        fillPaint.color.b = rbga.b
                        fillPaint.opacity = rbga.a
                    }
                    updateFillPaints()
                }}
                showText={(color) => {
                    return <div style={{ width: 55 }}>{color.toHexString().slice(1, 7).toUpperCase()}</div>
                }}
            />
            <InputNumber
                disabled={!visible}
                controls={false}
                style={{ width: 80, marginLeft: 2 }}
                min={0}
                max={100}
                addonAfter={"%"}
                size="small"
                value={alpha}
                onChange={(alpha) => {
                    if (alpha === null) return;
                    const val = Math.round((255 / 100) * alpha)
                    const colorHex = `${color.slice(0, 7)}${val.toString(16).padStart(2, '0')}`
                    setColor(colorHex)
                    const rbga = hexToRgba(colorHex)
                    if (rbga) {
                        fillPaint.color.r = rbga.r
                        fillPaint.color.g = rbga.g
                        fillPaint.color.b = rbga.b
                        fillPaint.opacity = rbga.a
                    }
                    updateFillPaints()
                }}
            />
        </div>
        <div className="fills-row">
            {visible && <Button onClick={changeVisible} type="text" size="small" icon={<svg style={{ marginTop: 2, marginRight: 2 }} width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M6 12c0-.066.054-.358.313-.825a5.9 5.9 0 0 1 1.12-1.414C8.443 8.816 9.956 8 12 8c2.045 0 3.558.816 4.566 1.76.508.477.88.98 1.121 1.415.258.467.313.76.313.825 0 .066-.055.358-.313.825-.24.435-.613.938-1.12 1.414C15.557 15.184 14.044 16 12 16c-2.045 0-3.558-.816-4.566-1.76a5.9 5.9 0 0 1-1.121-1.415C6.055 12.358 6 12.065 6 12Zm-1 0c0-1.25 2.333-5 7-5s7 3.75 7 5-2.333 5-7 5-7-3.75-7-5Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm1 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" clipRule="evenodd"></path></svg>} />}
            {!visible && <Button onClick={changeVisible} type="text" size="small" icon={<svg style={{ marginTop: 2, marginRight: 2 }} width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M5.5 9c.276 0 .533.223.641.477.044.102.1.218.172.348.24.435.613.938 1.121 1.414C8.442 12.184 9.954 13 12 13c2.045 0 3.558-.816 4.566-1.76.508-.477.88-.98 1.121-1.415.072-.13.128-.246.171-.348.11-.254.366-.477.642-.477s.495.225.417.49c-.202.682-.77 1.65-1.705 2.514l1.142 1.142a.5.5 0 0 1-.708.708l-1.217-1.218a7.422 7.422 0 0 1-1.89.958l.446 1.785a.5.5 0 0 1-.97.242l-.443-1.77A8.15 8.15 0 0 1 12 14a8.15 8.15 0 0 1-1.572-.15l-.443 1.771a.5.5 0 0 1-.97-.242l.446-1.785a7.421 7.421 0 0 1-1.89-.958l-1.217 1.218a.5.5 0 0 1-.708-.708l1.142-1.142c-.935-.864-1.503-1.832-1.705-2.514-.078-.265.14-.49.417-.49Z" clipRule="evenodd"></path></svg>} />}
            <Button onClick={removeFillPaint} type="text" size="small" icon={<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" d="M6.5 12h11"></path></svg>} />
        </div>
    </div>
}