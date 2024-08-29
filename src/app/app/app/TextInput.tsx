import {ChangeEventHandler, FormEventHandler, RefObject} from "react";
import {Button, Form, Stack} from "react-bootstrap";

interface TextInputProps {
    onSubmit: FormEventHandler<HTMLFormElement>
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    currentEntry: number
    inputRef: RefObject<HTMLTextAreaElement>
}

export default function TextInput({ onSubmit, onChange, currentEntry, inputRef }: TextInputProps) {
    return (
        <div className={"p-3 h-100"}>
            <Form onSubmit={onSubmit} className={"h-100"}>
                <Stack gap={3} className={"h-100"}>
                    <Form.Control
                        as={"textarea"}
                        className={"flex-grow-1"}
                        ref={inputRef}
                        placeholder="Enter an expression..."
                        isInvalid={currentEntry === 0 && !!inputRef.current?.value}
                        onChange={onChange}
                    />
                    <Form.Control.Feedback type={"invalid"}>Failed to parse
                        expression</Form.Control.Feedback>
                    <Button
                        variant="primary"
                        type={"submit"}
                        disabled={!currentEntry}
                    >Submit</Button>
                </Stack>
            </Form>
        </div>
    )
}