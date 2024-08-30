import {Button, Col, FormControl, Row, Stack} from "react-bootstrap";
import {ReactNode} from "react";

interface KeypadProps {
    currentInputText: string;
    valid: boolean
    onKeyDown: (e: string) => void;
    onBackspace: () => void;
    onClear: () => void;
    onSubmit: () => void;
}

const KEYS = new Map<string, ReactNode>([
    ["dd(", <mfrac><mi>d</mi><mi>dx</mi></mfrac>],
    ["in(", <mo>&int;</mo>],
    ["x", <mi>x</mi>],
    ["i", <mi>i</mi>],
    ["log(", <mi>log</mi>],
    ["^", <msup><mi>x</mi><mi>y</mi></msup>],
    [",", <mi>,</mi>],
    ["(", <mo>(</mo>],
    [")", <mo>)</mo>],
    ["/", <mo>&divide;</mo>],
    ["7", <mn>7</mn>],
    ["8", <mn>8</mn>],
    ["9", <mn>9</mn>],
    ["*", <mo>&times;</mo>],
    ["4", <mn>4</mn>],
    ["5", <mn>5</mn>],
    ["6", <mn>6</mn>],
    ["-", <mo>&minus;</mo>],
    ["1", <mn>1</mn>],
    ["2", <mn>2</mn>],
    ["3", <mn>3</mn>],
    ["+", <mo>+</mo>],
    ["0", <mn>0</mn>],
    [".", <mi>.</mi>],
    ["(-", <mi>(-)</mi>]
])

export default function Keypad({ currentInputText, valid, onKeyDown, onBackspace, onClear, onSubmit }: KeypadProps)
{
    console.log(Object.keys(KEYS))

    return (
        <Stack gap={2} className={"h-100 p-2"}>
            <FormControl value={currentInputText} isInvalid={!valid} readOnly />
            <Row xs={4} className={"g-2 flex-grow-1 overflow-y-scroll"}>
                <Col>
                    <Button variant={"light"} className={"w-100 h-100 border"} onClick={onClear}>Clear</Button>
                </Col>
                <Col>
                    <Button variant={"light"} className={"w-100 h-100 border"} onClick={onBackspace}><i className={"bi-backspace"} /></Button>
                </Col>
                {Array.from(KEYS.keys()).map((key, i) => (
                    <Col key={i}>
                        <Button variant={"light"} className={"w-100 h-100 border"} onClick={() => onKeyDown(key)}>
                            <math display={"block"}>{KEYS.get(key)}</math>
                        </Button>
                    </Col>
                ))}
                <Col>
                    <Button className={"w-100 h-100"} onClick={onSubmit} disabled={!valid}>Submit</Button>
                </Col>
            </Row>
        </Stack>
    )
}