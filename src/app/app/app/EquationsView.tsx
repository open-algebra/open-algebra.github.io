import {useEffect, useRef, useState} from "react";
import {useAppState} from "@/app/app/app/AppStateContext";
import BigCat from "../../../../public/big-cat.svg"
import Image from "next/image";
import {Alert} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";

export default function EquationsView() {
    const [showInDevWarning, setShowInDevWarning] = useState(true);
    const {history, currentInputExpressionStr, currentInputText} = useAppState()
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [history, currentInputText]);

    return (<div className={"h-full overflow-y-auto"}>
            <div className={"mx-auto max-w-5xl px-4 py-3"}>
                <div className="flex flex-col gap-3">
                    <div className={"mx-auto w-1/2"}>
                        <Image src={BigCat} alt={"big cat"} className={"h-auto w-full"} loading={"eager"} />
                    </div>
                    <h1 className={"text-center text-3xl font-semibold"}>Open Algebra Software for Inferring Solutions</h1>
                    {showInDevWarning ? <Alert>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                        <h5 className="mb-1 font-semibold">Here be dragons!</h5>
                        OASIS and OASIS Web are still under active development. If something does not work, please feel free to <a
                            className="font-medium underline-offset-4 hover:underline"
                            href={"https://github.com/open-algebra/Oasis/issues/new/choose"}>file an
                            issue</a>!
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setShowInDevWarning(false)}>Dismiss</Button>
                        </div>
                    </Alert>
                    : null}
                    {history.map(({query, response, error}, index) => (<div className="flex flex-col gap-2" key={index}>
                            <div className={"self-end rounded-3xl bg-primary/15 p-3"}>
                                <math display={"block"}
                                      dangerouslySetInnerHTML={{__html: query}}></math>
                            </div>
                            {error ? <div className={"self-start rounded-3xl bg-destructive/15 p-3 text-destructive"}>
                                <strong>Error:</strong> {response}
                            </div> : <div className={"self-start rounded-3xl bg-secondary p-3"}>
                                <math display={"block"}
                                      dangerouslySetInnerHTML={{__html: response}}></math>
                            </div>}
                        </div>))}
                    {currentInputExpressionStr &&
                            <div className="flex flex-col gap-3">
                                <div className={"self-end rounded-3xl bg-primary/15 p-3"}>
                                        <math display={"block"}
                                              dangerouslySetInnerHTML={{__html: currentInputExpressionStr}}></math>
                                </div>
                                <small className={"ml-auto font-mono text-muted-foreground"}>input string: {currentInputText}</small>
                            </div>
                    }
                </div>
            </div>
            <div ref={bottomRef}/>
        </div>)
}
