import {Button} from "@/components/ui/button";
import {FormEvent, ReactNode} from "react";
import {
    useAppState,
    useAppStateDispatch
} from "@/app/app/app/AppStateContext";

const KEYS = new Map<string, ReactNode>([// eslint-disable-next-line react/jsx-key
    ["dd(", <mfrac>
        <mi>d</mi>
        <mi>dx</mi>
    </mfrac>], // eslint-disable-next-line react/jsx-key
    ["in(", <mo>&int;</mo>], // eslint-disable-next-line react/jsx-key
    ["x", <mi>x</mi>], // eslint-disable-next-line react/jsx-key
    ["i", <mi>i</mi>], // eslint-disable-next-line react/jsx-key
    ["log(", <mi>log</mi>], // eslint-disable-next-line react/jsx-key
    ["^", <msup>
        <mi>x</mi>
        <mi>y</mi>
    </msup>], // eslint-disable-next-line react/jsx-key
    [",", <mi>,</mi>], // eslint-disable-next-line react/jsx-key
    ["(", <mo>(</mo>], // eslint-disable-next-line react/jsx-key
    [")", <mo>)</mo>], // eslint-disable-next-line react/jsx-key
    ["/", <mo>&divide;</mo>], // eslint-disable-next-line react/jsx-key
    ["7", <mn>7</mn>], // eslint-disable-next-line react/jsx-key
    ["8", <mn>8</mn>], // eslint-disable-next-line react/jsx-key
    ["9", <mn>9</mn>], // eslint-disable-next-line react/jsx-key
    ["*", <mo>&times;</mo>], // eslint-disable-next-line react/jsx-key
    ["4", <mn>4</mn>], // eslint-disable-next-line react/jsx-key
    ["5", <mn>5</mn>], // eslint-disable-next-line react/jsx-key
    ["6", <mn>6</mn>], // eslint-disable-next-line react/jsx-key
    ["-", <mo>&minus;</mo>], // eslint-disable-next-line react/jsx-key
    ["1", <mn>1</mn>], // eslint-disable-next-line react/jsx-key
    ["2", <mn>2</mn>], // eslint-disable-next-line react/jsx-key
    ["3", <mn>3</mn>], // eslint-disable-next-line react/jsx-key
    ["+", <mo>+</mo>], // eslint-disable-next-line react/jsx-key
    ["0", <mn>0</mn>], // eslint-disable-next-line react/jsx-key
    [".", <mi>.</mi>], // eslint-disable-next-line react/jsx-key
    ["(-", <mi>(-)</mi>]])

export default function Keypad() {
    const {currentInputValid} = useAppState();
    const dispatch = useAppStateDispatch();

    function appendToInput(addition: string) {
        dispatch && dispatch({ type: 'appendToInput', addition });
    }

    function clearTextInput() {
        dispatch && dispatch({ type: 'clearInput' });
    }

    function backspaceTextInput() {
        dispatch && dispatch({ type: 'backspaceInput' });
    }

    function onSubmit(e?: FormEvent) {
        if (e) e.preventDefault();
        dispatch && dispatch({ type: 'submitEntry' })
    }

    return (
            <div className="grid h-full grid-cols-4 gap-2 overflow-y-auto overflow-x-hidden p-2">
                <div className="aspect-square">
                    <Button variant="secondary" className="h-full w-full border" onClick={clearTextInput}>Clear</Button>
                </div>
                <div className="aspect-square">
                    <Button variant="secondary" className="h-full w-full border" onClick={backspaceTextInput}>Back</Button>
                </div>
                {Array.from(KEYS.keys()).map((key, i) => (
                    <div className="aspect-square" key={i}>
                        <Button variant="secondary" className="h-full w-full border" onClick={() => appendToInput(key)}>
                            <math display={"block"}>{KEYS.get(key)}</math>
                        </Button>
                    </div>
                ))}
                <div className="aspect-square">
                    <Button className="h-full w-full" onClick={onSubmit} disabled={!currentInputValid}>Enter</Button>
                </div>
            </div>)
}
