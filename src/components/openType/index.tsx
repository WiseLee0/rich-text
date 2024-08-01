import { Radio, Switch, Tooltip } from 'antd'
import './index.css'
import { Editor } from '../../rich-text'
import { useState } from 'react'
type OpenTypeCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    updateRender: () => void
}
export const OpenTypeComp = (props: OpenTypeCompProps) => {
    const { editorRef, updateRender } = props
    const editor = editorRef.current!
    const fullStyle = editor.getStyle(true)
    const [checkLiga, setCheckLiga] = useState(!fullStyle.toggledOffOTFeatures?.find(item => item === 'LIGA'))
    const font = editor.getFont(fullStyle.fontName?.family, fullStyle.fontName?.style)
    console.log(font?.availableFeatures);
    const showLiga = font?.availableFeatures.includes('liga')

    return <div className='opentype-container'>
        <span className="title">OpenType 特性</span>
        {showLiga && <div className="opentype-row">
            <Tooltip placement="top" title={`如 "fi"、"fl" 等，通常用于日常排版`} mouseEnterDelay={1}>
                <span>标准连字</span>
            </Tooltip>
            <Switch size="small" checked={checkLiga} onChange={val => {
                if (val) {
                    editor.setStyle({
                        toggledOffOTFeatures: fullStyle.toggledOffOTFeatures?.filter(item => item !== 'LIGA')
                    })
                } else {
                    editor.setStyle({
                        toggledOffOTFeatures: [...fullStyle.toggledOffOTFeatures ?? [], 'LIGA']
                    })
                }
                editor.apply()
                setCheckLiga(val)
            }} />
        </div>}
    </div>
}