import {ChangeEventHandler, FormEventHandler, RefObject} from "react";
import {Button, Form, InputGroup} from "react-bootstrap";

interface TextInputProps {
    onSubmit: FormEventHandler<HTMLFormElement>
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    currentEntry: number
    inputRef: RefObject<HTMLInputElement>
}

export default function TextInput({ onSubmit, onChange, currentEntry, inputRef }: TextInputProps) {
    return (
        <Form onSubmit={onSubmit}>
            <InputGroup hasValidation>
                <Form.Control
                    ref={inputRef}
                    placeholder="Enter an expression..."
                    isInvalid={currentEntry === 0 && !!inputRef.current?.value}
                    onChange={onChange}
                />
                <Button
                    variant="primary"
                    type={"submit"}
                    disabled={!currentEntry}
                >Submit</Button>
                <Form.Control.Feedback type={"invalid"}>Failed to parse
                    expression</Form.Control.Feedback>
            </InputGroup>
        </Form>
    )
}