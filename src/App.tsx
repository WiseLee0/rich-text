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
import InterFont from './assets/Inter_1.ttf?url';


export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [spinning, setSpinning] = useState(true)
  const [, updateRender] = useReducer(i => i + 1, 0)
  const isCompositionRef = useRef(false)
  const editorRef = useRef<Editor>()
  const compositionAnchorRef = useRef([0, 0])
  const mouseRef = useRef({
    cursor: 'defalut',
    isDown: false,
    count: 0,
    time: 0
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
    const editor = await createEditor()
    editorRef.current = editor;

    await editor.fontMgrFromURL({
      family: "Inter",
      style: "Regular",
      postscript: "Inter-Regular",
    }, InterFont);

    editor.addEventListener('setStyle', () => {
      inputRef.current?.focus()
    });

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
    setTimeout(() => {
      editorRef.current?.layout(500);
      updateRender()
    }, 0);
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
      const { shiftKey } = e;
      const [x, y] = [e.offsetX - CANVAS_MARING, e.offsetY - CANVAS_MARING]
      mouseRef.current.isDown = true
      if (Date.now() - mouseRef.current.time > 300) {
        mouseRef.current.count = 1
      } else {
        if (mouseRef.current.count === 4) {
          mouseRef.current.count = 1
        } else {
          mouseRef.current.count++
        }
      }
      mouseRef.current.time = Date.now()

      setCursor(x, y)
      const editor = editorRef.current!
      if (mouseRef.current.cursor !== 'default' || x > editor.width || y > editor.height || x < 0 || y < 0) {
        editorRef.current?.deselection()
        return
      }
      editorRef.current?.selectForXY(x, y, { shift: shiftKey, click: true, clickCount: mouseRef.current.count })
      updateInputPosition()
    }
    const handleCanvasMouseMove = (e: MouseEvent) => {
      const { shiftKey } = e;
      const [x, y] = [e.offsetX - CANVAS_MARING, e.offsetY - CANVAS_MARING]
      setCanvasStyleCursor(x, y)
      const editor = editorRef.current!
      if (mouseRef.current.isDown && editor.hasSelection()) editor.selectForXY(x, y, { shift: shiftKey, move: true })
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
      inputRef.current?.focus()
    }

    /**
     * 处理 beforeinput 事件
     *
     * note: 大部分情况下 beforeinput 事件的默认行为都会被拦截，编辑器会根据
     * InputEvent 携带的信息去修改对应的部分
     * @param e
     */
    const onBeforeInput = (e: InputEvent) => {
      if (isCompositionRef.current) {
        return;
      }
      switch (e.inputType) {
        case 'insertCompositionText':
        case 'insertFromComposition':
        case 'deleteByComposition':
          // 输入法相关输入由 composition 事件负责处理，直接 break
          break;
        case 'insertLineBreak':
          // 如果有修改, 请测试插入链接
          break;
        case 'insertParagraph':
          break;
        case 'insertText':
          // 普通插入文字
          if (e.data) {
            editorRef.current!.insertText(e.data);
          }
          break;
        case 'deleteWordBackward':
        case 'deleteWordForward':
        case 'deleteContent':
        case 'deleteContentBackward':
        case 'deleteContentForward':
        case 'deleteSoftLineBackward':
        case 'deleteSoftLineForward':
          // 执行删除相关的行为时，Safari 在空 Input 上不会触发 beforeInput
          // 因此交由 keydown 处理
          e.preventDefault();
          break;
        case 'historyUndo':
        case 'historyRedo':
          // 撤销重做由 keydown 事件负责处理
          e.preventDefault();
          break;
        default:
          break;
      }
    }

    const onKeydown = (e: KeyboardEvent) => {
      // 处于输入法时交由浏览器处理
      if (isCompositionRef.current) {
        return;
      }
      const { shiftKey, metaKey } = e;

      switch (e.key) {
        case 'a':
          // 全选
          if (metaKey) {
            editorRef.current!.selectAll();
          }
          break;
        case 'Tab':
          // 缩进
          if (shiftKey) {
            editorRef.current!.reduceIndent();
            return;
          }
          editorRef.current!.addIndent();
          break;
        case '7':
          // 有序列表
          if (shiftKey && metaKey) {
            const type = editorRef.current!.getTextListTypeForSelection();
            if (type === 'ORDERED_LIST') {
              editorRef.current!.setTextList('PLAIN');
            } else {
              editorRef.current!.setTextList('ORDERED_LIST');
            }
          }
          break;
        case '8':
          // 无序列表
          if (shiftKey && metaKey) {
            const type = editorRef.current!.getTextListTypeForSelection();
            if (type === 'UNORDERED_LIST') {
              editorRef.current!.setTextList('PLAIN');
            } else {
              editorRef.current!.setTextList('UNORDERED_LIST');
            }
          }
          break;
        case 'Backspace':
          // 向前删除
          editorRef.current!.deleteText();
          break;
        case 'Delete':
          // 向后删除
          editorRef.current!.deleteText({ fn: true });
          break;
        case 'Enter':
          // 换行
          editorRef.current!.insertText('\n');
          break;
        case 'ArrowLeft':
          // 左键
          editorRef.current?.arrowMove('left')
          break;
        case 'ArrowRight':
          // 右键
          editorRef.current?.arrowMove('right')
          break;
        case 'ArrowUp':
          // 上键
          editorRef.current?.arrowMove('top')
          break;
        case 'ArrowDown':
          // 下键
          editorRef.current?.arrowMove('bottom')
          break;
        default:
          break;
      }
    }

    const onCompositionStart = () => {
      isCompositionRef.current = true;
      if (!editorRef.current!.isCollapse()) {
        editorRef.current!.deleteText()
      }
      const selection = editorRef.current!.getSelection()
      compositionAnchorRef.current = [selection.anchor, selection.anchorOffset];
    }
    const onCompositionUpdate = (e: CompositionEvent) => {
      editorRef.current!.setSelection({
        anchor: compositionAnchorRef.current[0],
        anchorOffset: compositionAnchorRef.current[1],
      })
      if (!editorRef.current!.isCollapse()) {
        editorRef.current!.deleteText()
      }
      editorRef.current!.insertText(e.data);
      updateInputPosition()
    }
    const onCompositionEnd = (e: CompositionEvent) => {
      onCompositionUpdate(e)
      isCompositionRef.current = false;
    }

    const updateInputPosition = () => {
      inputRef.current!.value = ""
      const [x, y] = editorRef.current!.getSelectionXY()
      const fontsize = editorRef.current?.getStyle().fontSize || 0;
      inputRef.current!.style.fontSize = `${fontsize}px`;
      inputRef.current!.style.height = `${fontsize}px`;
      inputRef.current!.style.lineHeight = `${fontsize}px`;
      const tx = canvasRef.current!.offsetLeft + x + CANVAS_MARING
      const ty = canvasRef.current!.offsetTop + y + CANVAS_MARING - fontsize
      inputRef.current!.style.transform = `translate3d(${tx}px,${ty}px,0)`
    }

    canvasRef.current?.addEventListener('mousedown', handleCanvasMouseDown)
    canvasRef.current?.addEventListener('mousemove', handleCanvasMouseMove)
    canvasRef.current?.addEventListener('mouseup', handleCanvasMouseUp)
    inputRef.current?.addEventListener('beforeinput', onBeforeInput)
    inputRef.current?.addEventListener('keydown', onKeydown)
    inputRef.current?.addEventListener('compositionstart', onCompositionStart)
    inputRef.current?.addEventListener('compositionupdate', onCompositionUpdate)
    inputRef.current?.addEventListener('compositionend', onCompositionEnd)
    return () => {
      canvasRef.current?.removeEventListener('mousedown', handleCanvasMouseDown)
      canvasRef.current?.removeEventListener('mousemove', handleCanvasMouseMove)
      canvasRef.current?.removeEventListener('mouseup', handleCanvasMouseUp)
      inputRef.current?.removeEventListener('beforeinput', onBeforeInput)
      inputRef.current?.removeEventListener('keydown', onKeydown)
      inputRef.current?.removeEventListener('compositionstart', onCompositionStart)
      inputRef.current?.removeEventListener('compositionupdate', onCompositionUpdate)
      inputRef.current?.removeEventListener('compositionend', onCompositionEnd)
    }
  }, [])



  return (
    <div>
      <Spin spinning={spinning} fullscreen />
      <div className='page'>
        <canvas ref={canvasRef} style={{ width: CANVAS_W, height: CANVAS_H }}></canvas>
        <input type="text" tabIndex={-1} id="_textEditorInput" autoComplete="off" autoCorrect="off" ref={inputRef} />
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