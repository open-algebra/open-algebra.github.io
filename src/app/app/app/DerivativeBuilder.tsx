import {ChangeEvent, FormEvent, useState} from "react";
import {Button, Col, Form, FormControl, Modal, ModalProps, Row, Stack} from "react-bootstrap";
import {useAppStateDispatch} from "@/app/app/app/AppStateContext";

interface DerivativeBuilderProps {
    oasis: any
}

export default function DerivativeBuilder({
                                            oasis, onHide, ...props
                                        }: DerivativeBuilderProps & ModalProps) {
    const [firstArg, setFirstArg] = useState("");
    const [secondArg, setSecondArg] = useState("");
    const dispatch = useAppStateDispatch();

    let currentEntry = null;

    const composedFunction = `dd(${firstArg},${secondArg})`
    const preprocessedInput = oasis.ccall('Oa_PreProcessInFix', 'string', ['string'], [composedFunction]);

    if (firstArg && secondArg) {
        const currentEntryExpr = (firstArg && secondArg) ? oasis.ccall('Oa_FromInFix', 'number', ['string'], [preprocessedInput]) : 0;
        if (currentEntryExpr) {
            currentEntry = oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [currentEntryExpr]);
            oasis.ccall('Oa_Free', 'void', ['number'], [currentEntryExpr]);
        }
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();

        if (!dispatch) return;
        dispatch({type: 'appendToInput', addition: composedFunction})

        currentEntry = null;
        onHide && onHide();
    }

    return (<Modal onHide={onHide} {...props}>
        <Modal.Header closeButton>
            <Modal.Title>Derivative Builder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Stack direction="horizontal" className="justify-content-center py-5">
                {currentEntry
                    ? <math display={"block"}
                            dangerouslySetInnerHTML={{__html: currentEntry}}></math>
                    : "Failed to parse expression"}

            </Stack>
            <Form onSubmit={onSubmit}>
                <Stack gap={3}>
                    <Row className={"g-2"}>
                        <Col xs={2}>
                            <Stack gap={1}>
                                <math><mo>d</mo></math>
                                <hr className={"m-0 border-black"} />
                                <Stack direction={"horizontal"}>
                                    <math>
                                        <mo>d</mo>
                                    </math>
                                    <FormControl size={"sm"} className={"text-center"} placeholder={"x"} onChange={(e: ChangeEvent<HTMLInputElement>) => setSecondArg(e.target.value)}/>
                                </Stack>
                            </Stack>
                        </Col>
                        <Col className={"my-auto"}>
                            <FormControl placeholder={"x^2"} onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstArg(e.target.value)}/>
                        </Col>
                    </Row>
                    <Button
                        variant="primary"
                        type={"submit"}
                        disabled={!currentEntry}
                    >Submit</Button>
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>)
}