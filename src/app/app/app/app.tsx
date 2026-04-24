'use client'

import {
    Button, Card, Container, Modal, Nav, Navbar, NavDropdown, Stack
} from "react-bootstrap";
import React, {ReactElement, useEffect, useMemo, useState} from "react";
import {DragDropProvider, DragEndEvent, useDraggable, useDroppable} from "@dnd-kit/react";
import { AppStateProvider } from "@/app/app/app/AppStateContext";
import FunctionBuilder from "@/app/app/app/FunctionBuilder";
import EquationsView from "@/app/app/app/EquationsView";
import TextInput from "@/app/app/app/TextInput";
import Keypad from "@/app/app/app/Keypad";
import DownloadXMLButton from "@/app/app/app/DownloadXMLButton";
import DerivativeBuilder from "@/app/app/app/DerivativeBuilder";

import "./style.scss"
import {MainModule} from "@open-algebra/oasis/oasis-web";
import Link from "next/link";

type ViewId = 'Equations View' | 'Text Input' | 'Keypad';

type WindowLeaf = {
    kind: 'leaf';
    id: ViewId;
};

type WindowSplit = {
    kind: 'split';
    direction: 'row' | 'column';
    first: WindowNode;
    second: WindowNode;
    splitPercentage: number;
};

type WindowNode = WindowLeaf | WindowSplit;

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

function containsView(node: WindowNode | null, viewId: ViewId): boolean {
    if (!node) return false;
    if (node.kind === 'leaf') return node.id === viewId;
    return containsView(node.first, viewId) || containsView(node.second, viewId);
}

function addLeaf(node: WindowNode | null, viewId: ViewId): WindowNode {
    if (!node) {
        return { kind: 'leaf', id: viewId };
    }
    if (containsView(node, viewId)) {
        return node;
    }
    return {
        kind: 'split',
        direction: 'row',
        first: node,
        second: { kind: 'leaf', id: viewId },
        splitPercentage: 66,
    };
}

function removeLeaf(node: WindowNode | null, viewId: ViewId): WindowNode | null {
    if (!node) return null;
    if (node.kind === 'leaf') {
        return node.id === viewId ? null : node;
    }

    const first = removeLeaf(node.first, viewId);
    const second = removeLeaf(node.second, viewId);

    if (!first && !second) return null;
    if (!first) return second;
    if (!second) return first;

    return {
        ...node,
        first,
        second,
    };
}

function swapLeaves(node: WindowNode | null, firstId: ViewId, secondId: ViewId): WindowNode | null {
    if (!node) return null;

    if (node.kind === 'leaf') {
        if (node.id === firstId) return { kind: 'leaf', id: secondId };
        if (node.id === secondId) return { kind: 'leaf', id: firstId };
        return node;
    }

    return {
        ...node,
        first: swapLeaves(node.first, firstId, secondId)!,
        second: swapLeaves(node.second, firstId, secondId)!,
    };
}

function resizeByPath(node: WindowNode | null, path: string, splitPercentage: number): WindowNode | null {
    if (!node) return null;
    if (path.length === 0) {
        if (node.kind !== 'split') return node;
        return {
            ...node,
            splitPercentage,
        };
    }
    if (node.kind !== 'split') return node;

    const [head, ...rest] = path.split('.');
    const nextPath = rest.join('.');
    if (head === 'first') {
        return {
            ...node,
            first: resizeByPath(node.first, nextPath, splitPercentage)!,
        };
    }
    return {
        ...node,
        second: resizeByPath(node.second, nextPath, splitPercentage)!,
    };
}

function TilePanel(
    {
        id,
        canClose,
        title,
        children,
        onClose,
    }: {
        id: ViewId;
        canClose: boolean;
        title: string;
        children: ReactElement;
        onClose: (id: ViewId) => void;
    }
) {
    const drag = useDraggable({ id: `tile-${id}` });
    const drop = useDroppable({ id: `drop-${id}` });

    return (
        <Card
            ref={(node) => {
                drag.ref(node);
                drop.ref(node);
            }}
            className={`tile-panel h-100 shadow-sm ${drop.isDropTarget ? 'tile-panel-over' : ''} ${drag.isDragging ? 'tile-panel-dragging' : ''}`}
        >
            <Card.Header className="d-flex justify-content-between align-items-center gap-2 tile-panel-header">
                <div className="d-flex align-items-center gap-2">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className="tile-drag-handle"
                        ref={drag.handleRef}
                        title="Drag to swap windows"
                    >
                        <i className="bi bi-grid-3x3-gap-fill" />
                    </Button>
                    <span className="fw-semibold">{title}</span>
                </div>
                {canClose ? (
                    <Button
                        variant="outline-danger"
                        size="sm"
                        title="Close window"
                        onClick={() => onClose(id)}
                    >
                        <i className="bi bi-x-lg" />
                    </Button>
                ) : null}
            </Card.Header>
            <Card.Body className="tile-panel-body">{children}</Card.Body>
        </Card>
    );
}

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

    const viewElements: Record<ViewId, ReactElement> = useMemo(() => ({
        "Equations View": <EquationsView/>, "Text Input": <TextInput/>, "Keypad": <Keypad/>
    }), []);

    function handleCloseWindow(viewId: ViewId) {
        setWindowLayout((prev) => removeLeaf(prev, viewId));
    }

    function handleDragEnd(event: DragEndEvent) {
        const activeId = String(event.operation?.source?.id ?? '');
        const overId = String(event.operation?.target?.id ?? '');
        if (!activeId.startsWith('tile-') || !overId.startsWith('drop-')) return;

        const from = activeId.replace('tile-', '') as ViewId;
        const to = overId.replace('drop-', '') as ViewId;
        if (from === to) return;

        setWindowLayout((prev) => swapLeaves(prev, from, to));
    }

    function renderNode(node: WindowNode, path: string): ReactElement {
        if (node.kind === 'leaf') {
            return (
                <div className="tile-container" key={path || node.id}>
                    <TilePanel
                        id={node.id}
                        canClose={node.id !== 'Equations View'}
                        title={node.id}
                        onClose={handleCloseWindow}
                    >
                        {viewElements[node.id]}
                    </TilePanel>
                </div>
            );
        }

        const isRow = node.direction === 'row';
        const firstBasis = `${node.splitPercentage}%`;
        const secondBasis = `${100 - node.splitPercentage}%`;

        return (
            <div className={`tile-split ${isRow ? 'tile-split-row' : 'tile-split-column'}`} key={path || 'root'}>
                <div className="tile-split-pane" style={{ flexBasis: firstBasis }}>
                    {renderNode(node.first, `${path}${path ? '.' : ''}first`)}
                </div>
                <div className={`tile-divider ${isRow ? 'tile-divider-vertical' : 'tile-divider-horizontal'}`}>
                    <input
                        type="range"
                        min={10}
                        max={90}
                        value={node.splitPercentage}
                        onChange={(e) => {
                            const nextSplit = Number(e.target.value);
                            setWindowLayout((prev) => resizeByPath(prev, path, nextSplit));
                        }}
                        aria-label={`Resize ${isRow ? 'columns' : 'rows'}`}
                    />
                </div>
                <div className="tile-split-pane" style={{ flexBasis: secondBasis }}>
                    {renderNode(node.second, `${path}${path ? '.' : ''}second`)}
                </div>
            </div>
        );
    }

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
            <DragDropProvider onDragEnd={handleDragEnd}>
                <div className={"tiler-root bg-light-subtle flex-grow-1"}>
                    {windowLayout ? renderNode(windowLayout, '') : null}
                </div>
            </DragDropProvider>
        </Stack>
    </AppStateProvider>)
}