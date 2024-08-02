import { Radio, RadioChangeEvent, Tooltip } from 'antd'
import './index.css'
import { Editor } from '../../rich-text'
import { useEffect, useState } from 'react'
type OpenTypeCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    updateRender: () => void
}
export const OpenTypeComp = (props: OpenTypeCompProps) => {
    const { editorRef, updateRender } = props
    const editor = editorRef.current!
    const fullStyle = editor.getStyle(true)
    const [fontLigatures, setFontLigatures] = useState(fullStyle.fontLigatures)
    const font = editor.getFont(fullStyle.fontName?.family, fullStyle.fontName?.style)
    const showLiga = font?.availableFeatures.includes('liga')

    const handleFontLigaturesChange = (e: RadioChangeEvent) => {
        editor?.setStyle({
            fontLigatures: e.target.value
        })
        editor.apply()
        setFontLigatures(e.target.value)
    }

    useEffect(() => {
        const watchSelection = () => {
            const style = editorRef.current?.getStyle()
            if (style?.fontLigatures) setFontLigatures(style.fontLigatures)
        }
        editorRef.current?.addEventListener('selection', watchSelection)
        return () => {
            editorRef.current?.removeEventListener('selection', watchSelection)
        }
    }, [])

    return <div className='opentype-container'>
        <span className="title">OpenType 特性</span>
        {showLiga && <div className="opentype-row">
            <Tooltip placement="top" title={`如 "fi"、"fl" 等，通常用于日常排版`} mouseEnterDelay={1}>
                <span>常见连字</span>
            </Tooltip>
            <Radio.Group buttonStyle="solid" value={fontLigatures} onChange={handleFontLigaturesChange}>
                <Radio.Button value="DISABLE" style={{ height: 24, padding: 0 }} >
                    <span className="opentype-icon">
                        <svg width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" stroke="none" d="M10 9H6V8h4v1z"></path></svg>
                    </span>
                </Radio.Button>
                <Radio.Button value="ENABLE" style={{ height: 24, padding: 0 }} >
                    <span className="opentype-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(4 4)" fill="currentColor" fillRule="evenodd" stroke="none" d="M12.654 5.407 7 11.061 3.646 7.707 4.354 7 7 9.646 11.947 4.7l.707.707z"></path></svg>
                    </span>
                </Radio.Button>
            </Radio.Group>
        </div>}
    </div>
}