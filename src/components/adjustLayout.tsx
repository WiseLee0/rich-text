import { Row, Col, Slider, InputNumber, InputNumberProps, Divider } from "antd"
import { useEffect, useState } from "react";

export const AdjustLayout = (props: { onChange: (val: number) => any, title?: string, value: number, max: number, show: boolean }) => {
    const [inputValue, setInputValue] = useState(props.value);

    const onChange: InputNumberProps['onChange'] = (newValue) => {
        setInputValue(newValue as number);
        props.onChange?.(newValue as number)
    };

    useEffect(() => {
        setInputValue(props.value)
    }, [props.value])
    if (!props.show) return <></>

    return <div >
        <Divider orientation="left" style={{ fontSize: 12 }}>{props.title}</Divider>
        <Row >
            <Col span={15}>
                <Slider
                    min={0}
                    max={props.max}
                    onChange={onChange}
                    value={typeof inputValue === 'number' ? inputValue : 0}
                />
            </Col>
            < Col span={9} >
                <InputNumber
                    min={0}
                    max={props.max}
                    style={{ margin: '0 16px' }
                    }
                    value={inputValue}
                    onChange={onChange}
                />
            </Col>
        </Row>
    </div>
}