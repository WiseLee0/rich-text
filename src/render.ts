import { CanvasKit, Canvas } from "canvaskit-wasm"
import { Editor } from "./rich-text"

const theme_color = [11, 153, 255, 1] as [number, number, number, number]

export const renderBorder = (Skia: CanvasKit, canvas: Canvas, editorRef: React.MutableRefObject<Editor | undefined>) => {
    const editor = editorRef.current!
    const { width, height } = editor
    const paint = new Skia.Paint()
    paint.setColor(Skia.Color(...theme_color))
    paint.setStyle(Skia.PaintStyle.Stroke)
    canvas.drawRect([0, 0, width, height], paint)
    paint.delete()
}

export const renderText = (Skia: CanvasKit, canvas: Canvas, editorRef: React.MutableRefObject<Editor | undefined>) => {
    const editor = editorRef.current
    if (!editor || !editor.derivedTextData) return;
    const { glyphs, baselines } = editor.derivedTextData
    if (!glyphs?.length || !baselines?.length) return;
    const paint = new Skia.Paint()
    paint.setAntiAlias(true)

    // 渲染文字
    for (let i = 0; i < glyphs?.length; i++) {
        const glyph = glyphs[i];
        const path = Skia.Path.MakeFromSVGString(glyph.commandsBlob)!
        canvas.save()
        canvas.translate(glyph.position.x, glyph.position.y)
        canvas.drawPath(path, paint)
        canvas.restore()
        path.delete()
    }

    paint.setColor(Skia.Color(...theme_color))
    for (let i = 0; i < baselines?.length; i++) {
        const baseline = baselines[i];
        canvas.save()
        canvas.translate(baseline.position.x, baseline.position.y)
        canvas.drawRect([0, 0, baseline.width, 1], paint)
        canvas.restore()
    }

    paint.delete()

}

export const renderCursor = (Skia: CanvasKit, canvas: Canvas, editorRef: React.MutableRefObject<Editor | undefined>) => {
    if (!editorRef.current) return
    const editor = editorRef.current
    const paint = new Skia.Paint()
    const rects = editor.getSelectionRects()
    if (rects.length > 0 && !editor.isCollapse()) {
        paint.setColor(Skia.Color(...theme_color))
        paint.setAlphaf(0.3)
    }
    for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        canvas.drawRect(Skia.XYWHRect(...rect), paint)
    }
    paint.delete()
}