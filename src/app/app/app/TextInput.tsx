import {useRef, KeyboardEvent, useContext, FormEvent} from "react";
import {Button, Form, Stack} from "react-bootstrap";
import {AppStateContext, AppStateDispatchContext} from "@/app/app/app/AppStateContext";

export default function TextInput() {
    const { currentInputText, currentInputValid } = useContext(AppStateContext)
    const dispatch = useContext(AppStateDispatchContext)
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    function onEnterPress(e: KeyboardEvent<HTMLTextAreaElement>) {
        if(e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    }

    function onSubmit(e?: FormEvent) {
        if (e) e.preventDefault();
        dispatch && dispatch({ type: 'submitEntry' })
    }

    function onChange() {
        if (!inputRef.current) { return; }
        dispatch && dispatch({ type: 'setInput', input: inputRef.current.value });
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