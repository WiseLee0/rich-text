import { Radio, RadioChangeEvent, Tooltip } from 'antd'
import './index.css'
import { Editor } from '../../rich-text'
import { useEffect, useReducer, useState } from 'react'
type OpenTypeCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
}
export const OpenTypeComp = (props: OpenTypeCompProps) => {
    const { editorRef } = props
    const editor = editorRef.current!
    const fullStyle = editor.getStyle()
    const [, updateRender] = useReducer(i => i + 1, 0)
    const [fontLigatures, setFontLigatures] = useState(fullStyle.fontLigatures)
    const [fontPosition, setFontPosition] = useState(fullStyle.fontPosition)
    const [fontNumericFraction, setFontNumericFraction] = useState(fullStyle.fontNumericFraction)
    const font = editor.getFont(fullStyle.fontName?.family, fullStyle.fontName?.style)
    const availableFeatures = font?.availableFeatures
    const showLiga = availableFeatures?.includes('liga')
    const showPositionSubs = availableFeatures?.includes('subs')
    const showPositionSups = availableFeatures?.includes('sups')
    const showPosition = showPositionSubs && showPositionSups
    const showFrac = availableFeatures?.includes('frac') || availableFeatures?.includes('numr')

    const handleFontLigaturesChange = (e: RadioChangeEvent) => {
        editor?.setStyle({
            fontLigatures: e.target.value
        })
        setFontLigatures(e.target.value)
    }

    const handleFontPositionChange = (e: RadioChangeEvent) => {
        editor?.setStyle({
            fontPosition: e.target.value
        })
        setFontPosition(e.target.value)
    }

    const handleFontNumericFractionChange = (e: RadioChangeEvent) => {
        editor?.setStyle({
            fontNumericFraction: e.target.value
        })
        setFontNumericFraction(e.target.value)
    }

    useEffect(() => {
        const watchSelection = () => {
            const style = editorRef.current?.getStyleForSelection()
            if (style?.fontLigatures) setFontLigatures(style.fontLigatures)
            if (style?.fontPosition) setFontPosition(style.fontPosition)
            updateRender()
        }
        editorRef.current?.addEventListener('selection', watchSelection)
        editorRef.current?.addEventListener('setStyle', watchSelection)
        return () => {
            editorRef.current?.removeEventListener('selection', watchSelection)
            editorRef.current?.removeEventListener('setStyle', watchSelection)
        }
    }, [])

    if(!(showLiga || showPosition || showFrac)) return <></>

    return <div className='opentype-container'>
        <span className="title">字体特性</span>
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
        {showPosition && <div className="opentype-row">
            <span>数字角标</span>
            <Radio.Group buttonStyle="solid" value={fontPosition} onChange={handleFontPositionChange}>
                {showPositionSubs && <Tooltip placement="bottom" title={"下标"} mouseEnterDelay={1}>
                    <Radio.Button value="SUB" style={{ height: 24, padding: 0 }} >
                        <span className="opentype-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(4 4)" fill="currentColor" fillRule="nonzero" stroke="none" d="m2.585 12.5.878-2.472H6.99l.878 2.472h1.108L5.772 3.773h-1.09L1.476 12.5h1.108zm1.21-3.41 1.398-3.937h.068l1.398 3.938H3.795zM9.875 14h3.938v-.75h-2.608v-.034l1.108-.972c.938-.818 1.347-1.295 1.347-1.994 0-.886-.767-1.551-1.892-1.551-1.125 0-1.926.648-1.926 1.62h.886c0-.53.41-.887 1.023-.887.58 0 1.023.324 1.023.835 0 .443-.307.767-.904 1.296l-1.994 1.772V14z"></path></svg>
                        </span>
                    </Radio.Button>
                </Tooltip>}
                <Tooltip placement="bottom" title={"无"} mouseEnterDelay={1}>
                    <Radio.Button value="NONE" style={{ height: 24, padding: 0 }} >
                        <span className="opentype-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(4 4)" fill="currentColor" fillOpacity="1" fillRule="nonzero" stroke="none" d="m1.727 12.5.878-2.472h3.529L7.01 12.5h1.11L4.915 3.773H3.824L.619 12.5h1.108zm1.21-3.41 1.398-3.937h.068l1.398 3.938H2.937zm6.388 3.41h5.506v-.938h-4.057v-.068l1.96-2.096c1.5-1.607 1.944-2.357 1.944-3.324 0-1.347-1.091-2.42-2.625-2.42-1.53 0-2.694 1.04-2.694 2.573h1.006c0-.993.643-1.653 1.653-1.653.946 0 1.67.58 1.67 1.5 0 .805-.472 1.402-1.482 2.506l-2.88 3.153v.767z"></path></svg>
                        </span>
                    </Radio.Button>
                </Tooltip>
                {showPositionSups && <Tooltip placement="bottom" title={"上标"} mouseEnterDelay={1}>
                    <Radio.Button value="SUPER" style={{ height: 24, padding: 0 }} >
                        <span className="opentype-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24"><path transform="translate(4 4)" fill="currentColor" fillRule="nonzero" stroke="none" d="m2.935 12.5.878-2.472H7.34l.878 2.472h1.108L6.122 3.773h-1.09L1.826 12.5h1.108zm1.21-3.41 1.398-3.937h.068l1.398 3.938H4.145zm5.48-.954h3.938v-.75h-2.608v-.034l1.108-.971c.938-.819 1.347-1.296 1.347-1.995 0-.886-.767-1.55-1.892-1.55-1.125 0-1.926.647-1.926 1.619h.886c0-.529.41-.887 1.023-.887.58 0 1.023.324 1.023.835 0 .444-.307.767-.904 1.296L9.626 7.472v.664z"></path></svg>
                        </span>
                    </Radio.Button>
                </Tooltip>}
            </Radio.Group>
        </div>}
        {showFrac && <div className="opentype-row">
            <span>数字分数</span>
            <Radio.Group buttonStyle="solid" value={fontNumericFraction} onChange={handleFontNumericFractionChange}>
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