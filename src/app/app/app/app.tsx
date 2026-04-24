'use client'

import {
    Container, Modal, Nav, Navbar, NavDropdown, Stack
} from "react-bootstrap";
import React, {ReactElement, useEffect, useMemo, useState} from "react";
import { AppStateProvider } from "@/app/app/app/AppStateContext";
import FunctionBuilder from "@/app/app/app/FunctionBuilder";
import EquationsView from "@/app/app/app/EquationsView";
import TextInput from "@/app/app/app/TextInput";
import Keypad from "@/app/app/app/Keypad";
import DownloadXMLButton from "@/app/app/app/DownloadXMLButton";
import DerivativeBuilder from "@/app/app/app/DerivativeBuilder";

import {
    Tiler,
    TilePanel,
    WindowNode,
    containsView,
    addLeaf,
    removeLeaf,
} from "@/components/Tiler";

import "./style.scss"
import {MainModule} from "@open-algebra/oasis/oasis-web";
import Link from "next/link";

type ViewId = 'Equations View' | 'Text Input' | 'Keypad';

const defaultLayout: WindowNode = {
    kind: 'split',
    direction: 'row',
    first: { kind: 'leaf', id: 'Equations View' },
    second: {
        kind: 'split',
        direction: 'column',
        first: { kind: 'leaf', id: 'Text Input' },
        second: { kind: 'leaf', id: 'Keypad' },
        splitPercentage: 25,
    },
    splitPercentage: 75,
};

export default function App({oasis}: { oasis: MainModule }) {
    const [showHelp, setShowHelp] = useState(false);
    const [showDerivativeBuilder, setShowDerivativeBuilder] = useState(false);
    const [showIntegralBuilder, setShowIntegralBuilder] = useState(false);
    const [showLogBuilder, setShowLogBuilder] = useState(false);
    const [windowLayout, setWindowLayout] = useState<WindowNode | null>(defaultLayout)

    function closeHelp() {
        setShowHelp(false)
    }

    function openTiledWindow(viewId: ViewId) {
        setWindowLayout((prev) => addLeaf(prev, viewId));
    }

    function isWindowOpen(viewId: ViewId): boolean {
        return containsView(windowLayout, viewId);
    }

    function handleCloseWindow(viewId: ViewId) {
        setWindowLayout((prev) => removeLeaf(prev, viewId));
    }

    const viewElements: Record<ViewId, ReactElement> = useMemo(() => ({
        "Equations View": <EquationsView/>, "Text Input": <TextInput/>, "Keypad": <Keypad/>
    }), []);

    const renderTile = (id: ViewId, canClose: boolean, onClose: (id: ViewId) => void) => (
        <TilePanel
            id={id}
            canClose={canClose}
            title={id}
            onClose={onClose}
        >
            {viewElements[id]}
        </TilePanel>
    );

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia('(max-width: 991px)').matches) return
        setWindowLayout({
            kind: 'split',
            direction: "column",
            first: { kind: 'leaf', id: "Equations View" },
            second: { kind: 'leaf', id: "Keypad" },
            splitPercentage: 50
        })
    }, []);

    return (<AppStateProvider oasis={oasis}>
        <DerivativeBuilder show={showDerivativeBuilder}
                         onHide={() => setShowDerivativeBuilder(false)} oasis={oasis!}/>
        <FunctionBuilder title={"Integral Builder"} func={"in"} firstArgLabel={"Argument"}
                         secondArgLabel={"Variable"} show={showIntegralBuilder}
                         onHide={() => setShowIntegralBuilder(false)} oasis={oasis!}/>
        <FunctionBuilder title={"Logarithm Builder"} func={"log"} firstArgLabel={"Base"}
                         secondArgLabel={"Argument"} show={showLogBuilder}
                         onHide={() => setShowLogBuilder(false)} oasis={oasis!}/>
        <Modal show={showHelp} onHide={closeHelp}>
            <Modal.Header closeButton>
                <Modal.Title>Help</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={"pb-3"}>
                    Welcome to OASIS! To get started, type in any expression such as &quot;2x+3x&quot; OASIS
                    automatically
                    recognizes the variables and is able to add them for you. Some variable names are reserved. For
                    instance &quot;i&quot; is reserved for imaginary numbers.
                </div>
                <h5>Functions</h5>
                OASIS also understands some functions. For instance, <code>dd(x^2,x)</code> takes derivative of x^2
                with respect to x. Likewise, <code>in(2x,x)</code> takes the integral of 2x with respect to x
                and &nbsp; <code>log(10,100)</code>
                takes the logarithm of 100 with a base of 10.
            </Modal.Body>
        </Modal>
        <Stack style={{height: "100svh"}}>
            <Navbar expand="lg" sticky="top">
                <Container fluid>
                    <Navbar.Brand>OASIS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavDropdown title="File">
                                <DownloadXMLButton/>
                            </NavDropdown>
                            <NavDropdown title="View">
                                <NavDropdown.Item as={"button"}
                                                  onClick={() => openTiledWindow("Text Input")}
                                                  disabled={isWindowOpen("Text Input")}>Open Text
                                    Input</NavDropdown.Item>
                                <NavDropdown.Item as={"button"}
                                                  onClick={() => openTiledWindow("Keypad")}
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
                                    href="https://github.com/open-algebra/Oasis">OASIS</NavDropdown.Item>
                                <NavDropdown.Item
                                    href="https://github.com/open-algebra/OasisC">OasisC</NavDropdown.Item>
                                <NavDropdown.Item href="https://github.com/open-algebra/webapp">OASIS
                                    Web</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Link href={"/"} passHref legacyBehavior>
                            <Nav.Link className={"text-muted"}>openalgebra.org <i className={"bi-box-arrow-up-right ps-1"} /></Nav.Link>
                        </Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Tiler
                value={windowLayout}
                onChange={setWindowLayout}
                renderTile={renderTile}
            />
        </Stack>
    </AppStateProvider>)
}