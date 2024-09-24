import {FormEventHandler, useRef, KeyboardEvent, useContext} from "react";
import {Button, Form, Stack} from "react-bootstrap";
import {AppStateContext} from "@/app/app/app/AppStateContext";


interface TextInputProps {
    onSubmit: FormEventHandler<HTMLFormElement>
    setCurrentText: (text: string) => void
}

export default function TextInput({ onSubmit, setCurrentText }: TextInputProps) {
    const { currentInputText, currentInputValid } = useContext(AppStateContext)
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
                        isInvalid={!currentInputValid}
                        onChange={onChange}
                        onKeyDown={onEnterPress}
                        value={currentInputText}
                    />
                    <Button
                        variant="primary"
                        type={"submit"}
                        disabled={!currentInputValid}
                    >Submit</Button>
                </Stack>
            </Form>
        </div>
    )
}