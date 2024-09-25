import {
    Container, Modal, Nav, Navbar, NavDropdown, Stack
} from "react-bootstrap";
import React, {FormEvent, ReactElement, useEffect, useState} from "react";
import {
    DEFAULT_CONTROLS_WITHOUT_CREATION, ExpandButton, Mosaic, MosaicNode, MosaicWindow
} from "react-mosaic-component";
import {Draft} from "immer";
import {useImmerReducer} from "use-immer";
import {Action, AppState, AppStateContext, AppStateDispatchContext, HistoryEntry} from "@/app/app/app/AppStateContext";
import FunctionBuilder from "@/app/app/app/FunctionBuilder";
import EquationsView from "@/app/app/app/EquationsView";
import TextInput from "@/app/app/app/TextInput";
import ParseExpression from "@/app/app/app/ParseExpression";
import Keypad from "@/app/app/app/Keypad";

import "./style.scss"

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

type ViewId = 'Equations View' | 'Text Input' | 'Keypad';

export default function App({oasis}: { oasis: any }) {
    function appStateReducer(draft: Draft<AppState>, action: Action) {
        switch (action.type) {
            case "submitEntry": {
                const preprocessedInput = oasis.ccall('Oa_PreProcessInFix', 'string', ['string'], [draft.currentInputText]);
                const query = oasis.ccall('Oa_FromInFix', 'number', ['string'], [preprocessedInput]);

                if (!query) return;

                const queryStr = oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [query])

                let result;
                try {
                    result = oasis.ccall('Oa_SimplifyNF', 'number', ['number'], [query]);
                } catch (error) {
                    draft.history.push({query: queryStr, response: (error as Error).message, error: true})
                    draft.currentInputText =  "";
                    draft.currentInputExpressionStr = "";
                    draft.currentInputValid = true;
                    return;
                }

                const resultStr = oasis.ccall('Oa_ExpressionToMathMLStr', 'string', ['number'], [result])

                oasis.ccall('Oa_Free', 'void', ['number'], [result]);
                oasis.ccall('Oa_Free', 'void', ['number'], [query]);

                draft.history.push({query: queryStr, response: resultStr, error: false})
                draft.currentInputText =  "";
                draft.currentInputExpressionStr = "";
                draft.currentInputValid = true;
            }
                break;
            case "addToHistory": {
                const {query, response} = action;
                draft.history.push({query, response, error: false})
            }
                break;
            case "addErrorToHistory": {
                const {query, error} = action;
                draft.history.push({query, response: error, error: true})
            }
                break;
            case "setInput": {
                const { input } = action
                const newInputExpressionStr = ParseExpression(oasis, input);
                if (newInputExpressionStr) draft.currentInputExpressionStr = newInputExpressionStr;

                draft.currentInputText = input
                draft.currentInputValid = newInputExpressionStr.length > 0;
            }
                break;
            case "appendToInput": {
                const { addition } = action;
                draft.currentInputText += addition;
                const newInputExpressionStr = ParseExpression(oasis, draft.currentInputText);
                if (newInputExpressionStr) draft.currentInputExpressionStr = newInputExpressionStr;
                draft.currentInputValid = newInputExpressionStr.length > 0;
            }
                break;
            case "clearInput":
                draft.currentInputText =  "";
                draft.currentInputExpressionStr = "";
                draft.currentInputValid = true;
                break;
            case "backspaceInput": {
                if (draft.currentInputText.length < 1) return;

                const newText = draft.currentInputText.slice(0, -1);
                const newInputExpressionStr = ParseExpression(oasis, newText);

                draft.currentInputText = newText;
                draft.currentInputExpressionStr = newInputExpressionStr || "";
                draft.currentInputValid = !!newInputExpressionStr;
            }
                break;
        }
    }

    const [appState, dispatch] = useImmerReducer(appStateReducer, {
        history: [],
        currentInputText: "",
        currentInputExpressionStr: "",
        currentInputValid: true
    });
    const [showHelp, setShowHelp] = useState(false);
    const [showDerivativeBuilder, setShowDerivativeBuilder] = useState(false);
    const [showIntegralBuilder, setShowIntegralBuilder] = useState(false);
    const [showLogBuilder, setShowLogBuilder] = useState(false);
    const [windowLayout, setWindowLayout] = useState<MosaicNode<ViewId> | null>({
        direction: 'row', first: 'Equations View', second: {
            direction: 'column', first: 'Text Input', second: 'Keypad', splitPercentage: 25
        }, splitPercentage: 75
    })

    function closeHelp() {
        setShowHelp(false)
    }

    function openMosaicWindow(viewId: ViewId) {
        setWindowLayout({
            direction: "row", first: windowLayout!, second: viewId, splitPercentage: 66,
        });
    }

    function isWindowOpen(viewId: ViewId): boolean {
        // Check if the viewId exists in the current windowLayout
        const checkInLayout = (layout: typeof windowLayout): boolean => {
            if (!layout) {
                return false;
            }
            if (typeof layout === 'string') {
                return layout === viewId;
            }
            return checkInLayout(layout.first) || checkInLayout(layout.second);
        };

        return checkInLayout(windowLayout);
    }

    const ELEMENT_MAP: Record<ViewId, ReactElement> = {
        "Equations View": <EquationsView />,
        "Text Input": <TextInput />,
        "Keypad": <Keypad />
    };

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia('(max-width: 991px)').matches) return
        setWindowLayout({
            direction: "column", first: "Equations View", second: "Keypad", splitPercentage: 50
        })
    }, []);

    return (<AppStateContext.Provider value={appState}>
        <AppStateDispatchContext.Provider value={dispatch}>
            <FunctionBuilder title={"Derivative Builder"} func={"dd"} firstArgLabel={"Argument"}
                             secondArgLabel={"Variable"} show={showDerivativeBuilder}
                             setShow={setShowDerivativeBuilder} oasis={oasis!}/>
            <FunctionBuilder title={"Integral Builder"} func={"in"} firstArgLabel={"Argument"}
                             secondArgLabel={"Variable"} show={showIntegralBuilder}
                             setShow={setShowIntegralBuilder} oasis={oasis!}/>
            <FunctionBuilder title={"Logarithm Builder"} func={"log"} firstArgLabel={"Base"}
                             secondArgLabel={"Argument"} show={showLogBuilder}
                             setShow={setShowLogBuilder} oasis={oasis!}/>
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
            <Stack style={{height: "100svh"}}>
                <Navbar expand="lg" sticky="top">
                    <Container fluid>
                        <Navbar.Brand>OASIS Web</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavDropdown title="File">
                                    <NavDropdown.Item as={"button"} onClick={() => downloadXML(appState.history)}>Export
                                        as
                                        XML</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="View">
                                    <NavDropdown.Item as={"button"}
                                                      onClick={() => openMosaicWindow("Text Input")}
                                                      disabled={isWindowOpen("Text Input")}>Open Text
                                        Input</NavDropdown.Item>
                                    <NavDropdown.Item as={"button"}
                                                      onClick={() => openMosaicWindow("Keypad")}
                                                      disabled={isWindowOpen("Keypad")}>Open Keypad</NavDropdown.Item>
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
                    renderTile={(id, path) => (<MosaicWindow<ViewId>
                            path={path} title={id} className={"rounded shadow border"}
                            toolbarControls={id !== 'Equations View' ? DEFAULT_CONTROLS_WITHOUT_CREATION : React.Children.toArray([
                                <ExpandButton/>])}>
                            {ELEMENT_MAP[id]}
                        </MosaicWindow>)}
                    value={windowLayout}
                    onChange={newLayout => setWindowLayout(newLayout)}
                />
            </Stack>
        </AppStateDispatchContext.Provider>
        </AppStateContext.Provider>)
}