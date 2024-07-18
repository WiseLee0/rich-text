import { useEffect, useReducer, useRef, useState } from 'react';
import './App.css'
import { CANVAS_W, CANVAS_H, loadSkia, CANVAS_MARING } from './utils';
import { Canvas } from 'canvaskit-wasm';
import { Spin } from 'antd';
import PlayRegular from './assets/Play-Regular.ttf'
import ResidentEvil from './assets/resident_evil_7.otf'
import { createEditor, Editor } from './rich-text';
import { AutoResizeComp } from './components/autoResize';
import { renderBorder, renderCursor, renderText } from './render';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [spinning, setSpinning] = useState(true)
  const [, updateRender] = useReducer(i => i + 1, 0)
  const editorRef = useRef<Editor>()

  const render = async () => {
    const [Skia, surface] = await loadSkia(canvasRef.current!);
    setSpinning(false)
    const drawFrame = (canvas: Canvas) => {
      canvas.clear(Skia.TRANSPARENT)
      canvas.save()
      canvas.scale(devicePixelRatio, devicePixelRatio)
      canvas.translate(CANVAS_MARING, CANVAS_MARING)
      renderText(Skia, canvas, editorRef)
      renderBorder(Skia, canvas, editorRef)
      renderCursor(Skia, canvas, editorRef)
      canvas.restore()
      surface.requestAnimationFrame(drawFrame)
    }
    surface.requestAnimationFrame(drawFrame)
  }

  const layout = (w?: number, h?: number) => {
    editorRef.current?.clearCache()
    editorRef.current?.deselect()
    editorRef.current?.layout(w, h)
    updateRender()
  }

  const handleEvents = () => {
    canvasRef.current?.addEventListener('mousedown', e => {
      const [x, y] = [e.offsetX - CANVAS_MARING, e.offsetY - CANVAS_MARING]
      editorRef.current?.selectForXY(x, y)
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
        editorRef.current?.translateSelection(1)
        updateRender()
        e.preventDefault()
      }
      if (e.key === 'ArrowLeft') {
        editorRef.current?.translateSelection(-1)
        updateRender()
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
    const data2 = await (await fetch(ResidentEvil)).arrayBuffer()
    const editor = createEditor()
    editor.fontMgrFromData([data1, data2])
    editor.setStyle({
      fontName: {
        family: "Play", style: "Regular", postscript: "Play-Regular"
      },
      fontSize: 24,
    })
    editorRef.current = editor
    layout(196)
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
      <canvas ref={canvasRef} style={{ width: CANVAS_W, height: CANVAS_H }}></canvas>
      <textarea
        ref={textareaRef} tabIndex={-1} wrap="off" aria-hidden="true" spellCheck="false" autoCorrect="off" className="focus-target"></textarea>
      <AutoResizeComp editorRef={editorRef} layout={layout} />
    </div>
  );
}