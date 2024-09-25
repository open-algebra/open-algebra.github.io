import {FormEvent, useRef, useState} from "react";
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
                                            title,
                                            func,
                                            firstArgLabel,
                                            secondArgLabel,
                                            oasis,
                                            onHide,
                                            ...props
                                        }: FunctionBuilderProps & ModalProps) {
    const [currentEntry, setCurrentEntry] = useState(0);
    const dispatch = useAppStateDispatch();
    const firstArgRef = useRef<HTMLInputElement>(null);
    const secondArgRef = useRef<HTMLInputElement>(null);

    function onUpdate() {
        if (!firstArgRef.current) return;
        if (!secondArgRef.current) return;

        const composedFunction = `${func}(${firstArgRef.current.value},${secondArgRef.current.value})`

        const preprocessedInput = oasis.ccall('Oa_PreProcessInFix', 'string', ['string'], [composedFunction]);
        const expression = oasis.ccall('Oa_FromInFix', 'number', ['string'], [preprocessedInput]);

        if (currentEntry) {
            oasis.ccall('Oa_Free','void', ['number'], [currentEntry]);
        }
        setCurrentEntry(expression)
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();

        if (!firstArgRef.current) return;
        if (!secondArgRef.current) return;

        const composedFunction = `${func}(${firstArgRef.current.value},${secondArgRef.current.value})`

        if (!dispatch) return;
        dispatch({ type: 'appendToInput', addition: composedFunction })

        onHide && onHide();
    }

    return (
        <Modal onHide={onHide} {...props}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack direction="horizontal" className="justify-content-center py-5">
                    {currentEntry
                        ? <math display={"block"}
                                dangerouslySetInnerHTML={{__html: oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [currentEntry])}}></math>
                        : "Failed to parse expression"}

                </Stack>
                <Form onSubmit={onSubmit}>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                            {firstArgLabel}
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control ref={firstArgRef} onChange={onUpdate}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                            {secondArgLabel}
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control ref={secondArgRef} onChange={onUpdate}/>
                        </Col>
                    </Form.Group>
                    <Button
                        variant="primary"
                        type={"submit"}
                        disabled={!currentEntry}
                    >Submit</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}