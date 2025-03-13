import {Alert, Container, Stack} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import {useAppState} from "@/app/app/app/AppStateContext";
import BigCat from "../../../../public/big-cat.svg"
import Image from "next/image";

export default function EquationsView() {
    const [showInDevWarning, setShowInDevWarning] = useState(true);
    const {history, currentInputExpressionStr, currentInputText} = useAppState()
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [history, currentInputText]);

    return (<div className={"h-100 overflow-y-auto"}>
            <Container className={"py-3"}>
                <Stack gap={3}>
                    <div className={"w-50 align-self-center"}>
                        <Image src={BigCat} alt={"big cat"} className={"w-100 h-auto"} />
                    </div>
                    <h1 className={"text-center"}>Open Algebra Software for Inferring Solutions</h1>
                    <Alert variant={"warning"} show={showInDevWarning} onClose={() => setShowInDevWarning(false)}
                           dismissible>
                        <h5>Here be dragons!</h5>
                        OASIS and OASIS Web are still under active development. If something does not work, please feel free to <Alert.Link
                            href={"https://github.com/open-algebra/Oasis/issues/new/choose"}>file an
                            issue</Alert.Link>!
                    </Alert>
                    {history.map(({query, response, error}, index) => (<Stack gap={2} key={index}>
                            <div className={"align-self-end bg-primary-subtle rounded-5 p-3"}>
                                <math display={"block"}
                                      dangerouslySetInnerHTML={{__html: query}}></math>
                            </div>
                            {error ? <div className={"align-self-start bg-danger-subtle rounded-5 p-3"}>
                                <strong>Error:</strong> {response}
                            </div> : <div className={"align-self-start bg-secondary-subtle rounded-5 p-3"}>
                                <math display={"block"}
                                      dangerouslySetInnerHTML={{__html: response}}></math>
                            </div>}
                        </Stack>))}
                    {currentInputExpressionStr &&
                            <Stack gap={3}>
                                <div className={"align-self-end bg-primary-subtle rounded-5 p-3"}>
                                        <math display={"block"}
                                              dangerouslySetInnerHTML={{__html: currentInputExpressionStr}}></math>
                                </div>
                                <small className={"font-monospace text-muted ms-auto"}>input string: {currentInputText}</small>
                            </Stack>
                    }
                </Stack>
            </Container>
            <div ref={bottomRef}/>
        </div>)
}