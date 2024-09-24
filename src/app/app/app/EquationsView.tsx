import {Alert, Container, Stack} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";

export interface HistoryEntry {
    query: string,
    response: string
    error: boolean
}

interface EquationsViewProps {
    history: HistoryEntry[]
    currentInputExpressionStr: string
}

export default function EquationsView({history, currentInputExpressionStr}: EquationsViewProps) {
    const [showInDevWarning, setShowInDevWarning] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [history, currentInputExpressionStr]);

    return (<div className={"h-100 overflow-y-scroll"}>
            <Container className={"py-3"}>
                <Stack gap={3}>
                    <Alert variant={"warning"} show={showInDevWarning} onClose={() => setShowInDevWarning(false)}
                           dismissible>Oasis,
                        OasisC, and Oasis Web are still under active development.
                        Here be dragons. If something does not work, please feel free to <Alert.Link
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
                    {currentInputExpressionStr && <div className={"align-self-end bg-primary-subtle rounded-5 p-3"}>
                        <math display={"block"}
                              dangerouslySetInnerHTML={{__html: currentInputExpressionStr}}></math>
                    </div>}
                </Stack>
            </Container>
            <div ref={bottomRef}/>
        </div>)
}