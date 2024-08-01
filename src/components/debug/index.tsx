import { Button, Switch } from 'antd'
import { Editor } from '../../rich-text'
import './index.css'
import { useState } from 'react'
type DebugCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    enableRef: React.MutableRefObject<any>
    updateRender: () => void
}
export const DebugComp = (props: DebugCompProps) => {
    const { editorRef, updateRender, enableRef } = props
    const [] = useState()
    return <div className="debug-container">
        <span className="title">开发调试</span>
        <div className="debug-row" style={{ marginTop: 10 }}>
            <span>基线显示</span>
            <Switch size="small" checked={enableRef.current?.baseline} onChange={val => {
                enableRef.current.baseline = val
                updateRender()
            }} />
        </div>
        <div className="debug-row" style={{ marginTop: 10 }}>
            <span>字符边框显示</span>
            <Switch size="small" checked={enableRef.current?.glyphBorder} onChange={val => {
                enableRef.current.glyphBorder = val
                updateRender()
            }} />
        </div>
        <div className="debug-row" style={{ marginTop: 10 }}>
            <span>打印文本数据</span>
            <Button
                type="primary"
                size="small"
                onClick={() => {
                    const info = (window as any).getData()
                    console.log(info);
                }}
            >
                Click me!
            </Button>
        </div>
    </div>
}