import {useRef, KeyboardEvent, FormEvent, ChangeEvent} from "react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
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
        <form onSubmit={onSubmit} className="h-full p-2" ref={formRef}>
            <div className="flex h-full flex-col gap-2 md:flex-row">
                <Textarea
                    className={`flex-1 resize-none ${!currentInputValid ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    style={{resize: "none"}}
                    placeholder="Enter an expression..."
                    onChange={onChange}
                    onKeyDown={onEnterPress}
                    value={currentInputText}
                />
                <Button
                    type={"submit"}
                    disabled={!currentInputValid}
                >Submit</Button>
            </div>
        </form>
    )
}
