import { useEffect, useReducer, useRef, useState } from 'react';
import './App.css'
import { CANVAS_W, CANVAS_H, loadSkia, CANVAS_MARING } from './utils';
import { Canvas } from 'canvaskit-wasm';
import { Spin } from 'antd';
import PlayRegular from './assets/Play-Regular.ttf'
import { createEditor, Editor, layout } from './rich-text';
import { AutoResizeComp } from './components/autoResize/index';
import { renderBaseLine, renderBorder, renderCursor, renderGlyphBorder, renderText, renderTextDecoration } from './render';
import { TypographyComp } from './components/typography';
import { DebugComp } from './components/debug';
import { FillsComp } from './components/fills';

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
      enableRef.current.baseline && renderBaseLine(Skia, canvas, editorRef)
      enableRef.current.glyphBorder && renderGlyphBorder(Skia, canvas, editorRef)
      renderCursor(Skia, canvas, editorRef)
      canvas.restore()
      surface.requestAnimationFrame(drawFrame)
    }
    surface.requestAnimationFrame(drawFrame)
  }

  const handleEvents = () => {
    canvasRef.current?.addEventListener('mousedown', e => {
      if (!editorRef.current) return;
      const [x, y] = [e.offsetX - CANVAS_MARING, e.offsetY - CANVAS_MARING]
      if (x > editorRef.current.width || y > editorRef.current.height || x < 0 || y < 0) {
        editorRef.current.deselection()
        return
      }
      editorRef.current?.selectForXY(x, y)
      mouseDownRef.current = true
    })
    canvasRef.current?.addEventListener('mousemove', e => {
      if (!mouseDownRef.current) return;
      const [x, y] = [e.offsetX - CANVAS_MARING, e.offsetY - CANVAS_MARING]
      editorRef.current?.selectForXY(x, y, false)
    })
    canvasRef.current?.addEventListener('mouseup', e => {
      if (!mouseDownRef.current) return;
      mouseDownRef.current = false
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
    editor.layout(300, 300);
    (window as any).getEditor = () => {
      return editorRef.current
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
        <div className='page-pannel'>
          {editorRef.current && <AutoResizeComp editorRef={editorRef} updateRender={updateRender} />}
          {editorRef.current && <TypographyComp editorRef={editorRef} updateRender={updateRender} />}
          {editorRef.current && <FillsComp editorRef={editorRef} updateRender={updateRender} />}
          {editorRef.current && <DebugComp editorRef={editorRef} updateRender={updateRender} enableRef={enableRef} />}
        </div>
      </div>
    </div>
  );
}