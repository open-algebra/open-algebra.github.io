import {useRef, KeyboardEvent, FormEvent, ChangeEvent} from "react";
import {Button, Form, Stack} from "react-bootstrap";
import {
    useAppState,
    useAppStateDispatch
} from "@/app/app/app/AppStateContext";

export default function TextInput() {
    const { currentInputText, currentInputValid } = useAppState();
    const dispatch = useAppStateDispatch();
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

    function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
        dispatch && dispatch({ type: 'setInput', input: e.target.value });
    }

    return (
        <Form onSubmit={onSubmit} className={"p-2 h-100"} ref={formRef}>
            <Stack className={"d-flex flex-column flex-md-row h-100"} gap={2}>
                <Form.Control
                    as={"textarea"}
                    className={"flex-grow-1"}
                    style={{resize: "none"}}
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
    )
}