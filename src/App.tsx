import { useEffect, useReducer, useRef } from 'react';
import './App.css'
import { testBaseLine } from './test/__baseLine';
import { testGlyphs } from './test/__glyphs';
import { loadFont, testAdvance } from './test/__helper';
import { CANVAS_W, CANVAS_H, loadSkia } from './utils';
import { Canvas, CanvasKit } from 'canvaskit-wasm';
import { AdjustLayout } from './components/adjustLayout';
import RichText from './richText';
import RichSelection from './richText/selection';

const test = () => {
  testAdvance()
  testBaseLine()
  testGlyphs()
}
// test()

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [, updateRender] = useReducer(i => i + 1, 0)

  const update = () => {
    RichSelection.reset()
    RichText.layout()
    updateRender()
  }

  const renderBorder = (Skia: CanvasKit, canvas: Canvas) => {
    const data = RichText.getData()
    const { x, y } = data.derivedTextData.layoutSize
    const paint = new Skia.Paint()
    paint.setColor(Skia.Color(11, 153, 255, 1))
    paint.setStyle(Skia.PaintStyle.Stroke)
    canvas.drawRect([0, 0, x, y], paint)
    paint.delete()
  }

  const renderText = (Skia: CanvasKit, canvas: Canvas) => {
    const data = RichText.getData()
    const { glyphs, baselines } = data.derivedTextData
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

    paint.setColor(Skia.Color(11, 153, 255, 1))
    for (let i = 0; i < baselines?.length; i++) {
      const baseline = baselines[i];
      canvas.save()
      canvas.translate(baseline.position.x, baseline.position.y)
      canvas.drawRect([0, 0, baseline.width, 1], paint)
      canvas.restore()
    }

    paint.delete()

  }

  const renderCursor = (Skia: CanvasKit, canvas: Canvas) => {
    const data = RichText.getData()
    const { glyphs, baselines } = data.derivedTextData
    const paint = new Skia.Paint()
    if (RichSelection.isCollapse) {
      const [yIdx, xIdx] = RichSelection.focus
      if (yIdx < 0 || xIdx < 0) return;
      const { firstCharacter, endCharacter, width, position, lineY, lineHeight } = baselines[yIdx]
      let cursorX = 0
      const cursorY = lineY
      if (xIdx >= endCharacter - firstCharacter) {
        cursorX = position.x + width
      } else {
        cursorX = glyphs[firstCharacter + xIdx].position.x
      }
      canvas.drawRect(Skia.XYWHRect(cursorX - 0.5, cursorY, 1, lineHeight), paint)
    }
    paint.delete()
  }

  const render = async () => {
    const [Skia, surface] = await loadSkia(canvasRef.current!, '../canvaskit.wasm');
    await loadFont()
    update()
    const drawFrame = (canvas: Canvas) => {
      canvas.clear(Skia.TRANSPARENT)
      canvas.save()
      canvas.translate(20, 20)
      renderText(Skia, canvas)
      renderBorder(Skia, canvas)
      renderCursor(Skia, canvas)
      canvas.restore()
      surface.requestAnimationFrame(drawFrame)
    }
    surface.requestAnimationFrame(drawFrame)
  }

  const handleSelection = ([x, y]: number[]) => {
    const offset = RichText.calcSelectionCollapse(x, y)
    RichSelection.setRange(offset, offset)
  }

  const handleEvents = () => {
    canvasRef.current?.addEventListener('mousedown', (e) => {
      handleSelection([e.offsetX - 20, e.offsetY - 20])
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 0);
    })
    textareaRef.current?.addEventListener('input', (e: any) => {

      if (RichSelection.hasRange && RichSelection.isCollapse) {
        let characters = RichText.characters
        const [idx, _] = RichText.getSelectionOffset()
        if (e.inputType === "insertText" && e.data) {
          characters = characters.slice(0, idx) + e.data + characters.slice(idx)
          RichSelection.updateOffset(e.data?.length)
        }
        RichText.setCharacters(characters)
        RichText.layout()
        RichText.updateSelectionRange()
        updateRender()
      }
    })
    textareaRef.current?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        RichSelection.updateOffset(1)
        RichText.updateSelectionRange()
        updateRender()
      }
      if (e.key === 'ArrowLeft') {
        RichSelection.updateOffset(-1)
        RichText.updateSelectionRange()
        updateRender()
      }
      if (e.key === 'Backspace') {
        if (RichSelection.isCollapse) {
          let characters = RichText.characters
          const [idx, _] = RichText.getSelectionOffset()
          characters = characters.slice(0, idx - 1) + characters.slice(idx)
          RichSelection.updateOffset(-1)
          RichText.setCharacters(characters)
          RichText.layout()
          RichText.updateSelectionRange()
          updateRender()
          e.preventDefault()
        }
      }
    })
    textareaRef.current?.focus()
  }

  const initRichData = () => {
    const init_data = {
      fontName: {
        family: "Play", style: "Regular", postscript: "Play-Regular"
      },
      textData: {
        characters: "twittle,hello    world",
      },
      fontSize: 24,
      derivedTextData: {
        layoutSize: {
          x: 150,
          y: 100
        },
      } as any
    }
    RichText.setData(init_data)
  }

  useEffect(() => {
    handleEvents()
    initRichData()
    render()
  }, [])

  const data = RichText.getData()

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: CANVAS_W, height: CANVAS_H }}></canvas>
      <textarea
        ref={textareaRef} tabIndex={-1} wrap="off" aria-hidden="true" spellCheck="false" autoCorrect="off" className="focus-target"></textarea>
      <div>
        <AdjustLayout
          title='调整文本框宽度'
          value={data?.derivedTextData?.layoutSize?.x ?? 0}
          max={CANVAS_W - 40}
          onChange={val => {
            RichText.setLayoutSizeX(val)
            update()
          }} />
        <AdjustLayout
          title='调整文本框高度'
          value={data?.derivedTextData?.layoutSize?.y ?? 0}
          max={CANVAS_H - 40}
          onChange={val => {
            RichText.setLayoutSizeY(val)
            update()
          }} />
      </div>
    </div>
  );
}