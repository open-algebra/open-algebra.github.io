import {ChangeEvent, FormEvent, useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {useAppStateDispatch} from "@/app/app/app/AppStateContext";
import {MainModule} from "@open-algebra/oasis/oasis-web";

interface FunctionBuilderProps {
    title: string
    func: string
    firstArgLabel: string
    secondArgLabel: string
    oasis: MainModule
    show: boolean
    onHide: () => void
}

export default function FunctionBuilder({
                                            title, func, firstArgLabel, secondArgLabel, oasis, onHide, show
                                        }: FunctionBuilderProps) {
    const [firstArg, setFirstArg] = useState("");
    const [secondArg, setSecondArg] = useState("");
    const dispatch = useAppStateDispatch();

    let currentEntry = null;

    const composedFunction = `${func}(${firstArg},${secondArg})`
    const preprocessedInput = oasis.PreProcessInFix(composedFunction);

    if (firstArg && secondArg) {
        const currentEntryExpr = (firstArg && secondArg) ? oasis.FromInFix(preprocessedInput) : 0;
        if (currentEntryExpr) currentEntry = oasis.ToMathMLString(currentEntryExpr);
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();

        if (!dispatch) return;
        dispatch({type: 'appendToInput', addition: composedFunction})

        onHide && onHide();
    }

    return (<Dialog open={show} onOpenChange={(open) => !open && onHide()}>
            <DialogContent onClose={onHide}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center py-8">
                    {currentEntry
                        ? <math display={"block"}
                                dangerouslySetInnerHTML={{__html: currentEntry}}></math>
                        : "Failed to parse expression"}

                </div>
                <form onSubmit={onSubmit} className="space-y-3">
                    <div className="grid gap-2 sm:grid-cols-[8rem_1fr] sm:items-center">
                        <label className="text-sm font-medium">
                            {firstArgLabel}
                        </label>
                        <Input onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstArg(e.target.value)}/>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-[8rem_1fr] sm:items-center">
                        <label className="text-sm font-medium">
                            {secondArgLabel}
                        </label>
                        <Input
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSecondArg(e.target.value)}/>
                    </div>
                    <Button
                        type={"submit"}
                        disabled={!currentEntry}
                    >Submit</Button>
                </form>
            </DialogContent>
        </Dialog>)
}
