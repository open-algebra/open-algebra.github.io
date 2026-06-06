import {ChangeEvent, FormEvent, useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {useAppStateDispatch} from "@/app/app/app/AppStateContext";
import {MainModule} from "@open-algebra/oasis/oasis-web";

interface DerivativeBuilderProps {
    oasis: MainModule
    show: boolean
    onHide: () => void
}

export default function DerivativeBuilder({
                                            oasis, onHide, show
                                        }: DerivativeBuilderProps) {
    const [firstArg, setFirstArg] = useState("");
    const [secondArg, setSecondArg] = useState("");
    const dispatch = useAppStateDispatch();

    const composedFunction = `dd(${firstArg},${secondArg})`
    const preprocessedInput = oasis.PreProcessInFix(composedFunction);
    const currentEntry = firstArg && secondArg
        ? (() => {
            const currentEntryExpr = oasis.FromInFix(preprocessedInput);
            return currentEntryExpr ? oasis.ToMathMLString(currentEntryExpr) : null;
        })()
        : null;

    function onSubmit(e: FormEvent) {
        e.preventDefault();

        if (!dispatch) return;
        dispatch({type: 'appendToInput', addition: composedFunction})
        onHide && onHide();
    }

    return (<Dialog open={show} onOpenChange={(open) => !open && onHide()}>
        <DialogContent onClose={onHide}>
            <DialogHeader>
                <DialogTitle>Derivative Builder</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center py-8">
                {currentEntry
                    ? <math display={"block"}
                            dangerouslySetInnerHTML={{__html: currentEntry}}></math>
                    : "Failed to parse expression"}

            </div>
            <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-3">
                    <div className={"grid grid-cols-[5rem_1fr] gap-2"}>
                        <div>
                            <div className="flex flex-col gap-1">
                                <math><mo>d</mo></math>
                                <hr className={"m-0 border-black"} />
                                <div className="flex items-center">
                                    <math>
                                        <mo>d</mo>
                                    </math>
                                    <Input className={"h-8 text-center"} placeholder={"x"} onChange={(e: ChangeEvent<HTMLInputElement>) => setSecondArg(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className={"my-auto"}>
                            <Input placeholder={"x^2"} onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstArg(e.target.value)}/>
                        </div>
                    </div>
                    <Button
                        type={"submit"}
                        disabled={!currentEntry}
                    >Submit</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>)
}
