import { CanvasKit, Canvas, Image } from "canvaskit-wasm"
import { Editor, GlyphsInterface } from "./rich-text"

const theme_color = [11, 153, 255, 1] as [number, number, number, number]
let emoji_image = new Map<string, Image>()

export const renderBaseLine = (Skia: CanvasKit, canvas: Canvas, editorRef: React.MutableRefObject<Editor | undefined>) => {
    const editor = editorRef.current
    if (!editor || !editor.derivedTextData) return;
    const { baselines } = editor.derivedTextData
    if (!baselines?.length) return;
    const paint = new Skia.Paint()
    paint.setAntiAlias(true)

    // 渲染基线
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

export const renderTextDecoration = (Skia: CanvasKit, canvas: Canvas, editorRef: React.MutableRefObject<Editor | undefined>) => {
    const editor = editorRef.current
    const baselines = editor?.getBaselines()
    if (!baselines?.length || !editor) return;
    const paint = new Skia.Paint()
    paint.setAntiAlias(true)
    const rects = editor.getTextDecorationRects()
    for (let i = 0; i < rects.length; i++) {
        const rect = rects[i];
        canvas.drawRect(Skia.XYWHRect(...rect), paint)
    }
    paint.delete()
}

export const renderBorder = (Skia: CanvasKit, canvas: Canvas, editorRef: React.MutableRefObject<Editor | undefined>) => {
    const editor = editorRef.current!
    const { width, height } = editor
    const paint = new Skia.Paint()
    const size = 2
    paint.setColor(Skia.Color(...theme_color))
    paint.setStyle(Skia.PaintStyle.Stroke)
    if (editor.isEditor) {
        canvas.drawRect([0, 0, width, height], paint)
        paint.delete()
        return
    }
    const rect1 = [-size, -size, size * 2, size * 2]
    const rect2 = [width - size * 2, -size, width + size, size * 2]
    const rect3 = [- size, height - size * 2, size * 2, height + size]
    const rect4 = [width - size * 2, height - size * 2, width + size, height + size]
    canvas.save()
    canvas.clipRect(rect1, Skia.ClipOp.Difference, true)
    canvas.clipRect(rect2, Skia.ClipOp.Difference, true)
    canvas.clipRect(rect3, Skia.ClipOp.Difference, true)
    canvas.clipRect(rect4, Skia.ClipOp.Difference, true)
    canvas.drawRect([0, 0, width, height], paint)
    canvas.restore()

    canvas.drawRect(rect1, paint)
    canvas.drawRect(rect2, paint)
    canvas.drawRect(rect3, paint)
    canvas.drawRect(rect4, paint)
    paint.delete()
}

export const renderText = (Skia: CanvasKit, canvas: Canvas, editorRef: React.MutableRefObject<Editor | undefined>) => {
    const editor = editorRef.current
    if (!editor || !editor.derivedTextData) return;
    const { glyphs, baselines } = editor.derivedTextData
    if (!glyphs?.length || !baselines?.length) return;
    const paint = new Skia.Paint()
    paint.setAntiAlias(true)
    const fillPaintsArr = editor.getFillPaintsForGlyphs()

    const renderGlyph = (glyphs: GlyphsInterface[], len: number) => {
        for (let idx = 0; idx < len; idx++) {
            const glyph = glyphs[idx];
            if (!glyph.commandsBlob) continue;
            const path = Skia.Path.MakeFromSVGString(glyph.commandsBlob)!
            canvas.save()
            canvas.translate(glyph.position.x, glyph.position.y)
            canvas.clipPath(path, Skia.ClipOp.Intersect, true)
            for (let j = 0; j < fillPaintsArr[idx].length; j++) {
                const fillPaint = fillPaintsArr[idx][j];
                if (!fillPaint.visible) continue
                // 注意：这里alpha取opacity
                paint.setColor([fillPaint.color.r, fillPaint.color.g, fillPaint.color.b, fillPaint.opacity])
                canvas.drawPaint(paint)
            }
            canvas.restore()
            path.delete()
        }
    }
    const renderEmoji = (glyphs: GlyphsInterface[], len: number) => {
        for (let idx = 0; idx < len; idx++) {
            const glyph = glyphs[idx];
            if (!glyph.emojiCodePoints?.length) continue;
            const key = glyph.emojiCodePoints.map(item => item.toString(16)).join('-')

            const renderImage = (image?: Image) => {
                if (!image) return;
                canvas.drawImageRectOptions(image, [0, 0, image.width(), image.height()], glyph.emojiRect!, Skia.FilterMode.Linear, Skia.MipmapMode.Linear)
            }

            if (!emoji_image.has(key)) {
                emoji_image.set(key, null!)
                fetch(`https://static.figma.com/emoji/5/apple/medium/${key}.png`).then(async res => {
                    if (res.ok) {
                        const buffer = await res.arrayBuffer()
                        const image = Skia.MakeImageFromEncoded(buffer)
                        emoji_image.set(key, image!)
                        if (image) renderImage(image)
                    } else {
                        console.warn(`请求emoji ${key}失败`);
                        emoji_image.set(key, null!)
                    }
                })
            } else {
                const image = emoji_image.get(key)
                renderImage(image)
            }
        }
    }

    // 编辑态文本渲染
    if (editor.hasSelection()) {
        for (let i = 0; i < glyphs?.length; i++) {
            const glyph = glyphs[i];
            // 渲染省略内容
            if (editor.style.textTruncation === 'ENABLE' && editor.style.truncationStartIndex > -1 && i >= editor.style.truncationStartIndex) {
                const path = Skia.Path.MakeFromSVGString(glyph.commandsBlob)!
                canvas.save()
                canvas.translate(glyph.position.x, glyph.position.y)
                canvas.clipPath(path, Skia.ClipOp.Intersect, true)
                paint.setColor([0.6, 0.6, 0.6, 1.0])
                // 使用差集混合模式
                paint.setBlendMode(Skia.BlendMode.Difference)
                canvas.drawPaint(paint)
                canvas.restore()
                path.delete()
                continue
            }
        }

        renderGlyph(glyphs, glyphs?.length)
        renderEmoji(glyphs, glyphs?.length)
    } else {
        let len = glyphs?.length

        // 渲染省略号
        if (editor.style.textTruncation === 'ENABLE' && editor.style.truncationStartIndex > -1) {
            len = editor.style.truncationStartIndex
            const glyph = glyphs[len - 1];
            if (!glyph) {
                console.warn('renderText exception')
                return
            }

            const xAdvance = glyph.xAdvance ?? 0
            const fillPaints = fillPaintsArr[len - 2]
            const path = Skia.Path.MakeFromSVGString(glyph.commandsBlob)!
            for (let i = 0; i < 3; i++) {
                canvas.save()
                canvas.translate(glyph.position.x + xAdvance * i, glyph.position.y)
                canvas.clipPath(path, Skia.ClipOp.Intersect, true)
                for (let j = 0; j < fillPaints.length; j++) {
                    const fillPaint = fillPaints[j];
                    if (!fillPaint.visible) continue
                    // 注意：这里alpha取opacity
                    paint.setColor([fillPaint.color.r, fillPaint.color.g, fillPaint.color.b, fillPaint.opacity])
                    canvas.drawPaint(paint)
                }
                canvas.restore()
            }
            path.delete()
        }

        renderGlyph(glyphs, len)
        renderEmoji(glyphs, len)
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