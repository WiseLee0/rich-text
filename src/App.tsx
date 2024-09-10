import { useEffect, useReducer, useRef, useState } from 'react';
import './App.css'
import { CANVAS_W, CANVAS_H, loadSkia, CANVAS_MARING } from './utils';
import { Canvas } from 'canvaskit-wasm';
import { Spin } from 'antd';
import { createEditor, Editor } from './rich-text';
import { AutoResizeComp } from './components/autoResize/index';
import { renderBaseLine, renderBorder, renderCursor, renderText } from './render';
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
  const isCompositionRef = useRef(false)
  const editorRef = useRef<Editor>()
  const mouseRef = useRef({
    cursor: 'defalut',
    isDown: false
  })

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
      renderBaseLine(Skia, canvas, editorRef)
      renderCursor(Skia, canvas, editorRef)
      canvas.restore()
      surface.requestAnimationFrame(drawFrame)
    }
    surface.requestAnimationFrame(drawFrame)
  }

  const initRichData = async () => {
    const data1 = await (await fetch(`https://static.figma.com/font/Inter_1`)).arrayBuffer()
    const editor = await createEditor()
    editor.fontMgrFromData([data1])
    editorRef.current = editor;
    editor.layout(500);

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
  }

  useEffect(() => {
    main()
  }, [])

  useEffect(() => {
    const setCursor = (x: number, y: number) => {
      if (Math.abs(x - editorRef.current!.width) < 5 && Math.abs(y - editorRef.current!.height) < 5) {
        mouseRef.current.cursor = 'nwse-resize'
      } else if (Math.abs(x - editorRef.current!.width) < 5) {
        mouseRef.current.cursor = 'ew-resize'
      } else if (Math.abs(y - editorRef.current!.height) < 5) {
        mouseRef.current.cursor = 'ns-resize'
      } else {
        mouseRef.current.cursor = 'default'
      }
      canvasRef.current!.style.cursor = mouseRef.current.cursor
    }
    const setCanvasStyleCursor = (x: number, y: number) => {
      if (Math.abs(x - editorRef.current!.width) < 5 && Math.abs(y - editorRef.current!.height) < 5) {
        canvasRef.current!.style.cursor = 'nwse-resize'
      } else if (Math.abs(x - editorRef.current!.width) < 5) {
        canvasRef.current!.style.cursor = 'ew-resize'
      } else if (Math.abs(y - editorRef.current!.height) < 5) {
        canvasRef.current!.style.cursor = 'ns-resize'
      } else {
        canvasRef.current!.style.cursor = 'default'
      }
    }
    const handleCanvasMouseDown = (e: MouseEvent) => {
      const [x, y] = [e.offsetX - CANVAS_MARING, e.offsetY - CANVAS_MARING]
      mouseRef.current.isDown = true
      setCursor(x, y)
      const editor = editorRef.current!
      if (mouseRef.current.cursor !== 'default' || x > editor.width || y > editor.height || x < 0 || y < 0) {
        editorRef.current?.deselection()
        return
      }
      editorRef.current?.selectForXY(x, y)
    }
    const handleCanvasMouseMove = (e: MouseEvent) => {
      const [x, y] = [e.offsetX - CANVAS_MARING, e.offsetY - CANVAS_MARING]
      setCanvasStyleCursor(x, y)
      const editor = editorRef.current!
      if (mouseRef.current.isDown && editor.hasSelection()) editor.selectForXY(x, y, false)
      if (mouseRef.current.isDown) {
        if (mouseRef.current.cursor === 'nwse-resize') {
          editor.layout(x, y)
        } else if (mouseRef.current.cursor === 'ew-resize') {
          editor.layoutW(x)
        } else if (mouseRef.current.cursor === 'ns-resize') {
          editor.layoutH(y)
        }
        updateRender()
      }
    }
    const handleCanvasMouseUp = (e: MouseEvent) => {
      const [x, y] = [e.offsetX - CANVAS_MARING, e.offsetY - CANVAS_MARING]
      mouseRef.current.isDown = false
      setCursor(x, y)
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 0);
    }
    const handleTextareaCompositionstart = () => {
      isCompositionRef.current = true
    }
    const handleTextareaCompositionend = (e: any) => {
      isCompositionRef.current = false
      hanldeInsertText(e)
    }
    const hanldeInsertText = (e: any) => {
      if (isCompositionRef.current) return
      editorRef.current?.insertText(e.data)
      updateRender()
    }
    const handleTextareaKeyDown = (e: KeyboardEvent) => {
      // 整体修改
      if (!editorRef.current?.isEditor) {
        return
      }

      if (e.metaKey && e.key === 'a') {
        editorRef.current?.selectAll()
        e.preventDefault()
        return
      }
      if (e.metaKey && e.shiftKey && e.key === '7') {
        if (editorRef.current?.getTextListTypeForSelection() === 'ORDERED_LIST') {
          editorRef.current?.setTextList("PLAIN")
        } else {
          editorRef.current?.setTextList("ORDERED_LIST")
        }
        e.preventDefault()
        return
      }
      if (e.metaKey && e.shiftKey && e.key === '8') {
        if (editorRef.current?.getTextListTypeForSelection() === 'UNORDERED_LIST') {
          editorRef.current?.setTextList("PLAIN")
        } else {
          editorRef.current?.setTextList("UNORDERED_LIST")
        }
        e.preventDefault()
        return
      }
      if (e.key === 'Tab' && e.shiftKey) {
        editorRef.current?.reduceIndent()
        e.preventDefault()
        return
      }
      if (e.key === 'Tab' && !e.shiftKey) {
        editorRef.current?.addIndent()
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        return
      }
      if (e.key === 'Backspace') {
        editorRef.current?.deleteText()
        updateRender()
        e.preventDefault()
        return
      }
      if (e.key === 'Enter') {
        editorRef.current?.insertText('\n')
        updateRender()
        e.preventDefault()
        return
      }
    }
    canvasRef.current?.addEventListener('mousedown', handleCanvasMouseDown)
    canvasRef.current?.addEventListener('mousemove', handleCanvasMouseMove)
    canvasRef.current?.addEventListener('mouseup', handleCanvasMouseUp)
    textareaRef.current?.addEventListener('input', hanldeInsertText)
    textareaRef.current?.addEventListener('keydown', handleTextareaKeyDown)
    textareaRef.current?.addEventListener('compositionstart', handleTextareaCompositionstart)
    textareaRef.current?.addEventListener('compositionend', handleTextareaCompositionend)
    return () => {
      canvasRef.current?.removeEventListener('mousedown', handleCanvasMouseDown)
      canvasRef.current?.removeEventListener('mousemove', handleCanvasMouseMove)
      canvasRef.current?.removeEventListener('mouseup', handleCanvasMouseUp)
      textareaRef.current?.removeEventListener('input', hanldeInsertText)
      textareaRef.current?.removeEventListener('keydown', handleTextareaKeyDown)
      textareaRef.current?.removeEventListener('compositionstart', handleTextareaCompositionstart)
      textareaRef.current?.removeEventListener('compositionend', handleTextareaCompositionend)
    }
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
          {editorRef.current && <ParagraphComp editorRef={editorRef} updateRender={updateRender} />}
          {editorRef.current && <FillsComp editorRef={editorRef} />}
          {editorRef.current && <OpenTypeComp editorRef={editorRef} />}
          {editorRef.current && <DebugComp editorRef={editorRef} updateRender={updateRender} />}
        </div>
      </div>
    </div>
  );
}