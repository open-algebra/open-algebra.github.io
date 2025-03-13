import {Button, Col, FormControl, Row, Stack} from "react-bootstrap";
import {FormEvent, ReactNode} from "react";
import {
    useAppState,
    useAppStateDispatch
} from "@/app/app/app/AppStateContext";

const KEYS = new Map<string, ReactNode>([// eslint-disable-next-line react/jsx-key
    ["dd(", <mfrac>
        <mi>d</mi>
        <mi>dx</mi>
    </mfrac>], // eslint-disable-next-line react/jsx-key
    ["in(", <mo>&int;</mo>], // eslint-disable-next-line react/jsx-key
    ["x", <mi>x</mi>], // eslint-disable-next-line react/jsx-key
    ["i", <mi>i</mi>], // eslint-disable-next-line react/jsx-key
    ["log(", <mi>log</mi>], // eslint-disable-next-line react/jsx-key
    ["^", <msup>
        <mi>x</mi>
        <mi>y</mi>
    </msup>], // eslint-disable-next-line react/jsx-key
    [",", <mi>,</mi>], // eslint-disable-next-line react/jsx-key
    ["(", <mo>(</mo>], // eslint-disable-next-line react/jsx-key
    [")", <mo>)</mo>], // eslint-disable-next-line react/jsx-key
    ["/", <mo>&divide;</mo>], // eslint-disable-next-line react/jsx-key
    ["7", <mn>7</mn>], // eslint-disable-next-line react/jsx-key
    ["8", <mn>8</mn>], // eslint-disable-next-line react/jsx-key
    ["9", <mn>9</mn>], // eslint-disable-next-line react/jsx-key
    ["*", <mo>&times;</mo>], // eslint-disable-next-line react/jsx-key
    ["4", <mn>4</mn>], // eslint-disable-next-line react/jsx-key
    ["5", <mn>5</mn>], // eslint-disable-next-line react/jsx-key
    ["6", <mn>6</mn>], // eslint-disable-next-line react/jsx-key
    ["-", <mo>&minus;</mo>], // eslint-disable-next-line react/jsx-key
    ["1", <mn>1</mn>], // eslint-disable-next-line react/jsx-key
    ["2", <mn>2</mn>], // eslint-disable-next-line react/jsx-key
    ["3", <mn>3</mn>], // eslint-disable-next-line react/jsx-key
    ["+", <mo>+</mo>], // eslint-disable-next-line react/jsx-key
    ["0", <mn>0</mn>], // eslint-disable-next-line react/jsx-key
    [".", <mi>.</mi>], // eslint-disable-next-line react/jsx-key
    ["(-", <mi>(-)</mi>]])

export default function Keypad() {
    const {currentInputText, currentInputValid} = useAppState();
    const dispatch = useAppStateDispatch();

    function appendToInput(addition: string) {
        dispatch && dispatch({ type: 'appendToInput', addition });
    }

    function clearTextInput() {
        dispatch && dispatch({ type: 'clearInput' });
    }

    function backspaceTextInput() {
        dispatch && dispatch({ type: 'backspaceInput' });
    }

    function onSubmit(e?: FormEvent) {
        if (e) e.preventDefault();
        dispatch && dispatch({ type: 'submitEntry' })
    }

    return (<Stack gap={2} className={"h-100 p-2"}>
            <FormControl as={"textarea"} className={"flex-grow-1"} placeholder={"Expression text input preview..."} value={currentInputText} isInvalid={!currentInputValid} readOnly/>
            <Row xs={4} className={"g-2 overflow-y-auto overflow-x-hidden"}>
                <Col>
                    <div className={"ratio ratio-1x1"}>
                        <Button variant={"light"} className={"w-100 h-100 border"} onClick={clearTextInput}>Clear</Button>
                    </div>
                </Col>
                <Col>
                    <div className={"ratio ratio-1x1"}>
                        <Button variant={"light"} className={"w-100 h-100 border"} onClick={backspaceTextInput}><i
                            className={"bi-backspace"}/></Button>
                    </div>
                </Col>
                {Array.from(KEYS.keys()).map((key, i) => (<Col key={i}>
                    <div className={"ratio ratio-1x1"}>
                        <Button variant={"light"} className={"w-100 h-100 border"} onClick={() => appendToInput(key)}>
                            <math display={"block"}>{KEYS.get(key)}</math>
                        </Button>
                    </div>
                    </Col>))}
                <Col>
                    <div className={"ratio ratio-1x1"}>
                        <Button className={"w-100 h-100"} onClick={onSubmit} disabled={!currentInputValid}>Submit</Button>
                    </div>
                </Col>
            </Row>
        </Stack>)
}