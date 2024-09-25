import {ChangeEvent, FormEvent, useState} from "react";
import {Button, Col, Form, Modal, ModalProps, Row, Stack} from "react-bootstrap";
import {useAppStateDispatch} from "@/app/app/app/AppStateContext";

interface FunctionBuilderProps {
    title: string
    func: string
    firstArgLabel: string
    secondArgLabel: string
    oasis: any
}

export default function FunctionBuilder({
                                            title, func, firstArgLabel, secondArgLabel, oasis, onHide, ...props
                                        }: FunctionBuilderProps & ModalProps) {
    const [firstArg, setFirstArg] = useState("");
    const [secondArg, setSecondArg] = useState("");
    const dispatch = useAppStateDispatch();

    let currentEntry = null;

    const composedFunction = `${func}(${firstArg},${secondArg})`
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

        onHide && onHide();
    }

    return (<Modal onHide={onHide} {...props}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack direction="horizontal" className="justify-content-center py-5">
                    {currentEntry
                        ? <math display={"block"}
                                dangerouslySetInnerHTML={{__html: currentEntry}}></math>
                        : "Failed to parse expression"}

                </Stack>
                <Form onSubmit={onSubmit}>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column={true} sm="2">
                            {firstArgLabel}
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstArg(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column={true} sm="2">
                            {secondArgLabel}
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSecondArg(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    <Button
                        variant="primary"
                        type={"submit"}
                        disabled={!currentEntry}
                    >Submit</Button>
                </Form>
            </Modal.Body>
        </Modal>)
}