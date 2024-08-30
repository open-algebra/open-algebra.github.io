import {FormEventHandler, useRef, KeyboardEvent} from "react";
import {Button, Form, Stack} from "react-bootstrap";


interface TextInputProps {
    onSubmit: FormEventHandler<HTMLFormElement>
    currentText: string
    setCurrentText: (text: string) => void
    invalid: boolean
}

export default function TextInput({ onSubmit, currentText, setCurrentText, invalid }: TextInputProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    function onEnterPress(e: KeyboardEvent<HTMLTextAreaElement>) {
        if(e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    }

    function onChange() {
        if (!inputRef.current) { return; }
        setCurrentText(inputRef.current.value);
    }

    return (
        <div className={"p-3 h-100"}>
            <Form onSubmit={onSubmit} className={"h-100"} ref={formRef}>
                <Stack gap={3} className={"h-100"}>
                    <Form.Control
                        as={"textarea"}
                        className={"flex-grow-1"}
                        ref={inputRef}
                        placeholder="Enter an expression..."
                        isInvalid={invalid}
                        onChange={onChange}
                        onKeyDown={onEnterPress}
                        value={currentText}
                    />
                    <Form.Control.Feedback type={"invalid"}>Failed to parse
                        expression</Form.Control.Feedback>
                    <Button
                        variant="primary"
                        type={"submit"}
                        disabled={invalid}
                    >Submit</Button>
                </Stack>
            </Form>
        </div>
    )
}