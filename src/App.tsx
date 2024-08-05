import { useEffect, useReducer, useRef, useState } from 'react';
import './App.css'
import { CANVAS_W, CANVAS_H, loadSkia, CANVAS_MARING } from './utils';
import { Canvas } from 'canvaskit-wasm';
import { Spin } from 'antd';
import PlayRegular from './assets/Play-Regular.ttf'
import { createEditor, Editor } from './rich-text';
import { AutoResizeComp } from './components/autoResize/index';
import { renderBaseLine, renderBorder, renderCursor, renderGlyphBorder, renderText, renderTextDecoration } from './render';
import { TypographyComp } from './components/typography';
import { DebugComp } from './components/debug';
import { FillsComp } from './components/fills';
import { OpenTypeComp } from './components/openType';
import { ParagraphComp } from './components/paragraph';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [spinning, setSpinning] = useState(true)
  const [, updateRender] = useReducer(i => i + 1, 0)
  const enableRef = useRef({
    baseline: false,
    glyphBorder: false
  })
  const editorRef = useRef<Editor>()
  const mouseDownRef = useRef(false)
  const editorDownRef = useRef(false)

  const render = async () => {
    const [Skia, surface] = await loadSkia(canvasRef.current!);
    setSpinning(false)
    const drawFrame = (canvas: Canvas) => {
      canvas.clear(Skia.TRANSPARENT)
      canvas.save()
      canvas.scale(devicePixelRatio, devicePixelRatio)
      canvas.translate(CANVAS_MARING, CANVAS_MARING)
      renderText(Skia, canvas, editorRef)
      renderTextDecoration(Skia, canvas, editorRef)
      renderBorder(Skia, canvas, editorRef)
      renderBaseLine(Skia, canvas, editorRef, enableRef)
      enableRef.current.glyphBorder && renderGlyphBorder(Skia, canvas, editorRef)
      renderCursor(Skia, canvas, editorRef)
      canvas.restore()
      surface.requestAnimationFrame(drawFrame)
    }
    surface.requestAnimationFrame(drawFrame)
  }

  const handleEvents = () => {
    canvasRef.current?.addEventListener('mousedown', e => {
      // 拖拽框事件
      const [x, y] = [e.offsetX - CANVAS_MARING, e.offsetY - CANVAS_MARING]
      if (Math.abs(x - editorRef.current!.width) < 5 && Math.abs(y - editorRef.current!.height) < 5) {
        mouseDownRef.current = true
        canvasRef.current!.style.cursor = 'nwse-resize';
      } else if (Math.abs(x - editorRef.current!.width) < 5) {
        mouseDownRef.current = true
        canvasRef.current!.style.cursor = 'ew-resize';
      } else if (Math.abs(y - editorRef.current!.height) < 5) {
        mouseDownRef.current = true
        canvasRef.current!.style.cursor = 'ns-resize';
      } else {
        mouseDownRef.current = false
        canvasRef.current!.style.cursor = 'default';
      }
      if (mouseDownRef.current) {
        editorRef.current?.deselection()
        return
      }

      // 编辑事件
      if (!editorRef.current) return;
      if (x > editorRef.current.width || y > editorRef.current.height || x < 0 || y < 0) {
        editorRef.current.deselection()
        return
      }
      editorRef.current?.selectForXY(x, y)
      editorDownRef.current = true
    })
    canvasRef.current?.addEventListener('mousemove', e => {
      const [x, y] = [e.offsetX - CANVAS_MARING, e.offsetY - CANVAS_MARING]

      // 拖拽框事件
      if (mouseDownRef.current && canvasRef.current!.style.cursor === 'ew-resize') {
        editorRef.current!.layoutW(x)
        updateRender()
        return
      }
      if (mouseDownRef.current && canvasRef.current!.style.cursor === 'ns-resize') {
        editorRef.current!.layoutH(y)
        updateRender()
        return
      }
      if (mouseDownRef.current && canvasRef.current!.style.cursor === 'nwse-resize') {
        editorRef.current!.layout(x, y)
        updateRender()
        return
      }

      // 编辑事件
      if (!editorDownRef.current) return;
      editorRef.current?.selectForXY(x, y, false)
    })
    canvasRef.current?.addEventListener('mouseup', e => {
      mouseDownRef.current = false
      canvasRef.current!.style.cursor = 'default';
      if (!editorDownRef.current) return;
      editorDownRef.current = false
      const [x, y] = [e.offsetX - CANVAS_MARING, e.offsetY - CANVAS_MARING]
      editorRef.current?.selectForXY(x, y, false)
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 0);
    })


    textareaRef.current?.addEventListener('input', (e: any) => {
      editorRef.current?.insertText(e.data)
      updateRender()
    })

    textareaRef.current?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
      }
      if (e.key === 'Backspace') {
        editorRef.current?.deleteText()
        updateRender()
        e.preventDefault()
      }
      if (e.key === 'Enter') {
        editorRef.current?.insertText('\n')
        updateRender()
        e.preventDefault()
      }
    })
  }

  const initRichData = async () => {
    const data1 = await (await fetch(PlayRegular)).arrayBuffer()
    const editor = createEditor()
    editor.fontMgrFromData([data1])
    editorRef.current = editor;
    editor.layout(121);
    (window as any).getEditor = () => {
      return editorRef.current
    }
    (window as any).getData = () => {
      const obj: any = {}
      const editor = editorRef.current! as any
      for (const key in editor) {
        if (editor[key] instanceof Function) continue
        obj[key] = editor[key]
      }
      return obj
    }
  }

  const main = async () => {
    await initRichData()
    await render()
    handleEvents()
  }

  useEffect(() => {
    main()
  }, [])


  return (
    <div>
      <Spin spinning={spinning} fullscreen />
      <div className='page'>
        <canvas ref={canvasRef} style={{ width: CANVAS_W, height: CANVAS_H }}></canvas>
        <textarea
          ref={textareaRef} tabIndex={-1} wrap="off" aria-hidden="true" spellCheck="false" autoCorrect="off" className="focus-target"></textarea>
        <div className='page-pannel' style={{ maxHeight: CANVAS_H }}>
          {editorRef.current && <AutoResizeComp editorRef={editorRef} updateRender={updateRender} />}
          {editorRef.current && <TypographyComp editorRef={editorRef} />}
          {editorRef.current && <ParagraphComp editorRef={editorRef} />}
          {editorRef.current && <FillsComp editorRef={editorRef} />}
          {editorRef.current && <OpenTypeComp editorRef={editorRef} />}
          {editorRef.current && <DebugComp editorRef={editorRef} updateRender={updateRender} enableRef={enableRef} />}
        </div>
      </div>
    </div>
  );
}