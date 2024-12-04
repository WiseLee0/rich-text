import { Space } from "antd"
import "./index.css"

export const KeyBoardComp = () => {
    const editData = [
        {
            name: '下划线',
            key: '⌘ U'
        },
        {
            name: '删除线',
            key: '⌘ ⇧ X'
        },
        {
            name: '有序列表',
            key: '⌘ ⇧ 7'
        },
        {
            name: '无序列表',
            key: '⌘ ⇧ 8'
        },
        {
            name: '增大字号',
            key: '⌘ ⇧ >'
        },
        {
            name: '减少字号',
            key: '⌘ ⇧ <'
        },
        {
            name: '增大行高',
            key: '⌥ ⇧ >'
        },
        {
            name: '减少行高',
            key: '⌥ ⇧ <'
        },
        {
            name: '增大字间距',
            key: '⌥ >'
        },
        {
            name: '减少字间距',
            key: '⌥ <'
        },
        {
            name: '全选',
            key: '⌘ A'
        },
        {
            name: '向前删除',
            key: '⌫'
        },
        {
            name: '向后删除',
            key: 'Fn ⌫'
        },
        {
            name: '向前删除行',
            key: '⌘ ⌫'
        },
        {
            name: '向后删除行',
            key: '⌘ Fn ⌫'
        },
        {
            name: '左对齐',
            key: '⌘ ⌥ L'
        },
        {
            name: '水平居中对齐',
            key: '⌘ ⌥ T'
        },
        {
            name: '右对齐',
            key: '⌘ ⌥ R'
        },
        {
            name: '两端对齐',
            key: '⌘ ⌥ J'
        },
    ]
    const selecionData = [
        {
            name: '移动到当前段首',
            key: '⌘ ▲'
        },
        {
            name: '移动到当前段尾',
            key: '⌘ ▼'
        },
    ]
    return <div>
        <div className="keyboard-container">
            <span className="title">编辑快捷键</span>
            {
                editData.map((item, idx) => <div className="row" key={idx}>
                    <span className="row-title">{item.name}</span>
                    <Space>
                        {item.key.split(' ').map((char, charIdx) => <div className="keyboard" key={`char${charIdx}`}>{char}</div>)}
                    </Space>
                </div>)
            }
        </div>
        <div className="keyboard-container" style={{ marginTop: 1 }}>
            <span className="title">选区快捷键</span>
            <div className="row">
                <span className="row-title">移动光标</span>
                <Space>
                    <div className="keyboard">▲</div>
                    <div>/</div>
                    <div className="keyboard">▼</div>
                    <div>/</div>
                    <div className="keyboard">◀</div>
                    <div>/</div>
                    <div className="keyboard">▶</div>
                </Space>
            </div>
            <div className="row">
                <span className="row-title">移动选区</span>
                <Space>
                    <div className="keyboard">⇧</div>
                    <div>+</div>
                    <div className="keyboard">▲</div>
                    <div>/</div>
                    <div className="keyboard">▼</div>
                    <div>/</div>
                    <div className="keyboard">◀</div>
                    <div>/</div>
                    <div className="keyboard">▶</div>
                </Space>
            </div>
            <div className="row">
                <span className="row-title">移动到当前行首</span>
                <Space>
                    <div className="keyboard">⌘</div>
                    <div>/</div>
                    <div className="keyboard">Fn</div>
                    <div>+</div>
                    <div className="keyboard">◀</div>
                </Space>
            </div>
            <div className="row">
                <span className="row-title">移动到当前行尾</span>
                <Space>
                    <div className="keyboard">⌘</div>
                    <div>/</div>
                    <div className="keyboard">Fn</div>
                    <div>+</div>
                    <div className="keyboard">▶</div>
                </Space>
            </div>
            {
                selecionData.map((item, idx) => <div className="row" key={idx}>
                    <span className="row-title">{item.name}</span>
                    <Space>
                        {item.key.split(' ').map((char, charIdx) => <div className="keyboard" key={`char${charIdx}`}>{char}</div>)}
                    </Space>
                </div>)
            }
        </div>
    </div>
}