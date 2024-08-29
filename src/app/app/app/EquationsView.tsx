import {Alert, Container, Stack} from "react-bootstrap";
import {useState} from "react";

export interface HistoryEntry {
    query: string,
    response: string
    error: boolean
}

interface EquationsViewProps {
    history: HistoryEntry[]
    currentEntry: number
    oasis: any
}

export default function EquationsView({ history, currentEntry, oasis }: EquationsViewProps) {
    const [showInDevWarning, setShowInDevWarning] = useState(true);

    return (
        <Container>
            <Stack gap={3}>
                <div>
                    {showInDevWarning &&
                        <Alert variant={"warning"} onClose={() => setShowInDevWarning(false)} dismissible>Oasis,
                            OasisC, and Oasis Web are still under active development.
                            Here be dragons. If something does not work, please feel free to <Alert.Link
                                href={"https://github.com/open-algebra/Oasis/issues/new/choose"}>file an
                                issue</Alert.Link>!</Alert>}
                </div>
                {history.map(({query, response, error}, index) => (
                    <Stack gap={2} key={index}>
                        <div className={"align-self-end bg-primary-subtle rounded-5 p-3"}>
                            <math display={"block"}
                                  dangerouslySetInnerHTML={{__html: query}}></math>
                        </div>
                        {error
                            ? <div className={"align-self-start bg-danger-subtle rounded-5 p-3"}>
                                <strong>Error:</strong> {response}
                            </div>
                            : <div className={"align-self-start bg-secondary-subtle rounded-5 p-3"}>
                                <math display={"block"}
                                      dangerouslySetInnerHTML={{__html: response}}></math>
                            </div>}
                    </Stack>
                ))}
                {
                    !(currentEntry && oasis)
                        ? null
                        : <div className={"align-self-end bg-primary-subtle rounded-5 p-3"}>
                            <math display={"block"}
                                  dangerouslySetInnerHTML={{__html: oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [currentEntry])}}></math>
                        </div>
                }
            </Stack>
        </Container>
    )
}