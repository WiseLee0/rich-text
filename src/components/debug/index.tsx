import { Button, Switch } from 'antd'
import { Editor } from '../../rich-text'
import './index.css'
import { useState } from 'react'
type DebugCompProps = {
    editorRef: React.MutableRefObject<Editor | undefined>
    updateRender: () => void
}
export const DebugComp = (props: DebugCompProps) => {
    const {  updateRender } = props
    const [] = useState()
    return <div className="debug-container">
        <span className="title">开发调试</span>
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