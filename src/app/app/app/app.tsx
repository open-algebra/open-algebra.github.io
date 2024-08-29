import {
    Container,
    Modal,
    Nav,
    Navbar,
    NavDropdown,
    Stack
} from "react-bootstrap";
import {FormEvent, ReactElement, useEffect, useRef, useState} from "react";
import {DEFAULT_CONTROLS_WITHOUT_CREATION, Mosaic, MosaicNode, MosaicWindow} from "react-mosaic-component";
import FunctionBuilder from "@/components/FunctionBuilder";
import EquationsView, {HistoryEntry} from "@/app/app/app/EquationsView";
import TextInput from "@/app/app/app/TextInput";
import ParseExpression from "@/app/app/app/ParseExpression";

import "./style.css"

interface AppState {
    history: HistoryEntry[]
    currentInputText: string
    currentInputExpressionStr: string
    currentInputValid: boolean
}

function downloadXML(history: HistoryEntry[]) {

    const xmlDoc = document.implementation.createDocument(null, "root");
    const domParser = new window.DOMParser();

    for (const {query, response, error} of history) {
        const entryElem = xmlDoc.createElement("Entry");

        const queryElem = xmlDoc.createElement("Query");

        const queryMathElem = xmlDoc.createElement("math");
        queryMathElem.setAttribute("display", "block");

        const queryElemContent = domParser.parseFromString(query, 'text/xml');
        queryMathElem.appendChild(queryElemContent.documentElement.cloneNode(true));

        queryElem.appendChild(queryMathElem);

        const responseElem = xmlDoc.createElement(error ? "Error" : "Response")
        if (error) {
            responseElem.textContent = response;
        } else {
            const responseMathElem = xmlDoc.createElement("math");
            responseMathElem.setAttribute("display", "block");

            const responseElemContent = domParser.parseFromString(response, 'text/xml');
            responseMathElem.appendChild(responseElemContent.documentElement.cloneNode(true));

            responseElem.appendChild(responseMathElem);
        }

        entryElem.appendChild(queryElem);
        entryElem.appendChild(responseElem);
        xmlDoc.documentElement.appendChild(entryElem);
    }

    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);

    const blob = new Blob([xmlString], {type: "text/xml"});
    const url = URL.createObjectURL(blob);
    window.open(url);
}

export default function App({ oasis }: { oasis: any }) {
    type ViewId = 'Equations View' | 'Text Input';

    const bottomRef = useRef<HTMLDivElement>(null);
    const [appState, setAppState] = useState<AppState>({history: [], currentInputText: "", currentInputExpressionStr: "", currentInputValid: true});
    const [showHelp, setShowHelp] = useState(false);
    const [showDerivativeBuilder, setShowDerivativeBuilder] = useState(false);
    const [showIntegralBuilder, setShowIntegralBuilder] = useState(false);
    const [showLogBuilder, setShowLogBuilder] = useState(false);
    const [windowLayout, setWindowLayout] = useState<MosaicNode<ViewId> | null>({
        direction: 'column',
        first: 'Equations View',
        second: 'Text Input',
        splitPercentage: 80
    })

    function addToHistory(query: string, response: string) {
        setAppState({...appState, history: [...appState.history, {query, response, error: false}], currentInputText: "", currentInputExpressionStr: "", currentInputValid: true});
    }

    function addErrorToHistory(query: string, response: string) {
        setAppState({...appState, history: [...appState.history, {query, response, error: true}], currentInputText: "", currentInputExpressionStr: "", currentInputValid: true});
    }

    function appendToInput(addition: string) {
        appState.currentInputText += (appState.currentInputText === '' ? '' : ' ') + addition;
        appState.currentInputExpressionStr = ParseExpression(oasis, appState.currentInputText);
        setAppState({ ...appState, currentInputValid: appState.currentInputExpressionStr.length > 0 });
    }

    function onTextInputUpdate(str: string) {
        appState.currentInputExpressionStr = ParseExpression(oasis, str);
        setAppState({ ...appState, currentInputText: str, currentInputValid: appState.currentInputExpressionStr.length > 0 });
    }

    function closeHelp() {
        setShowHelp(false)
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();

        if (!oasis) return;

        const preprocessedInput = oasis.ccall('Oa_PreProcessInFix', 'string', ['string'], [appState.currentInputText]);
        const query = oasis.ccall('Oa_FromInFix', 'number', ['string'], [preprocessedInput]);

        if (!query) return;

        const queryStr = oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [query])

        let result;
        try {
            result = oasis.ccall('Oa_SimplifyNF', 'number', ['number'], [query]);
        } catch (error) {
            addErrorToHistory(queryStr, (error as Error).message)
            return;
        }

        const resultStr = oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [result])

        oasis.ccall('Oa_Free', 'void', ['number'], [result]);
        oasis.ccall('Oa_Free', 'void', ['number'], [query]);

        addToHistory(queryStr, resultStr);
    }

    const ELEMENT_MAP: Record<ViewId, ReactElement> = {
        "Equations View": <EquationsView history={appState.history} currentInputExpressionStr={appState.currentInputExpressionStr} oasis={oasis} />,
        "Text Input": <TextInput onSubmit={onSubmit} setCurrentText={onTextInputUpdate} currentText={appState.currentInputText} invalid={!appState.currentInputValid} />
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [appState]);

    return (
        <>
            <FunctionBuilder title={"Derivative Builder"} func={"dd"} firstArgLabel={"Argument"}
                             secondArgLabel={"Variable"} show={showDerivativeBuilder}
                             setShow={setShowDerivativeBuilder}
                             setResult={appendToInput} oasis={oasis!}/>
            <FunctionBuilder title={"Integral Builder"} func={"in"} firstArgLabel={"Argument"}
                             secondArgLabel={"Variable"} show={showIntegralBuilder}
                             setShow={setShowIntegralBuilder}
                             setResult={appendToInput} oasis={oasis!}/>
            <FunctionBuilder title={"Logarithm Builder"} func={"log"} firstArgLabel={"Base"}
                             secondArgLabel={"Argument"} show={showLogBuilder}
                             setShow={setShowLogBuilder}
                             setResult={appendToInput} oasis={oasis!}/>
            <Modal show={showHelp} onHide={closeHelp}>
                <Modal.Header closeButton>
                    <Modal.Title>Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={"pb-3"}>
                        Welcome to OASIS! To get started, type in any expression such as &quot;2x+3x&quot; Oasis
                        automatically
                        recognizes the variables and is able to add them for you. Some variable names are reserved. For
                        instance &quot;i&quot; is reserved for imaginary numbers.
                    </div>
                    <h5>Functions</h5>
                    Oasis also understands some functions. For instance, <code>dd(x^2,x)</code> takes derivative of x^2
                    with respect to x. Likewise, <code>in(2x,x)</code> takes the integral of 2x with respect to x
                    and &nbsp; <code>log(10,100)</code>
                    takes the logarithm of 100 with a base of 10.
                </Modal.Body>
            </Modal>
            <Stack className="min-vh-100">
                <Navbar expand="lg" className="bg-light-subtle" sticky="top">
                    <Container fluid>
                        <Navbar.Brand>OASIS Web</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavDropdown title="File">
                                    <NavDropdown.Item as={"button"} onClick={() => downloadXML(appState.history)}>Export as
                                        XML</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Functions">
                                    <NavDropdown.Item as={"button"}
                                                      onClick={() => setShowDerivativeBuilder(true)}>Derivative</NavDropdown.Item>
                                    <NavDropdown.Item as={"button"}
                                                      onClick={() => setShowIntegralBuilder(true)}>Integral</NavDropdown.Item>
                                    <NavDropdown.Item as={"button"}
                                                      onClick={() => setShowLogBuilder(true)}>Logarithm</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Help">
                                    <NavDropdown.Item as={"button"} onClick={() => setShowHelp(true)}>Get
                                        Started</NavDropdown.Item>
                                    <NavDropdown.Item href="https://github.com/open-algebra/Oasis/issues/new/choose">File
                                        an Issue</NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Header>GitHub Repositories</NavDropdown.Header>
                                    <NavDropdown.Item
                                        href="https://github.com/open-algebra/Oasis">Oasis</NavDropdown.Item>
                                    <NavDropdown.Item
                                        href="https://github.com/open-algebra/OasisC">OasisC</NavDropdown.Item>
                                    <NavDropdown.Item href="https://github.com/open-algebra/webapp">Oasis
                                        Web</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Mosaic<ViewId>
                    className={"mosaic-blueprint-theme bg-light-subtle flex-grow-1"}
                    blueprintNamespace={'bp5'}
                    renderTile={(id, path) => (
                        <MosaicWindow<ViewId> path={path} title={id} className={"rounded shadow border"} toolbarControls={DEFAULT_CONTROLS_WITHOUT_CREATION}>
                            {ELEMENT_MAP[id]}
                        </MosaicWindow>
                    )}
                    value={windowLayout}
                    onChange={newLayout => setWindowLayout(newLayout)}
                />
            </Stack>
            <div ref={bottomRef}/>
        </>
    )
}