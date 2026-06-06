'use client'

import React, {ReactElement, startTransition, useEffect, useMemo, useState} from "react";
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

import {MainModule} from "@open-algebra/oasis/oasis-web";
import Link from "next/link";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar";

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
            onClose={(closedId) => onClose(closedId as ViewId)}
        >
            {viewElements[id]}
        </TilePanel>
    );

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia('(max-width: 991px)').matches) return
        startTransition(() => {
            setWindowLayout({
                kind: 'split',
                direction: "column",
                first: { kind: 'leaf', id: "Equations View" },
                second: { kind: 'leaf', id: "Keypad" },
                splitPercentage: 50
            })
        });
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
        <Dialog open={showHelp} onOpenChange={(open) => !open && closeHelp()}>
            <DialogContent onClose={closeHelp}>
                <DialogHeader>
                    <DialogTitle>Help</DialogTitle>
                </DialogHeader>
                <div className={"pb-3"}>
                    Welcome to OASIS! To get started, type in any expression such as &quot;2x+3x&quot; OASIS
                    automatically
                    recognizes the variables and is able to add them for you. Some variable names are reserved. For
                    instance &quot;i&quot; is reserved for imaginary numbers.
                </div>
                <h5 className="mb-2 font-semibold">Functions</h5>
                OASIS also understands some functions. For instance, <code>dd(x^2,x)</code> takes derivative of x^2
                with respect to x. Likewise, <code>in(2x,x)</code> takes the integral of 2x with respect to x
                and &nbsp; <code>log(10,100)</code>
                takes the logarithm of 100 with a base of 10.
            </DialogContent>
        </Dialog>
        <div className="flex h-[100svh] flex-col bg-[radial-gradient(circle_at_top_left,oklch(0.91_0.04_220),transparent_24rem),linear-gradient(135deg,oklch(0.98_0.005_95),oklch(0.93_0.02_235))]">
            <header className="relative z-20 shrink-0">
                <div className="flex min-h-9 flex-wrap items-center gap-2 px-3 pt-2">
                    <div className="font-heading mr-2 text-sm font-semibold tracking-tight">OASIS</div>
                    <Menubar className="h-7 border-none bg-transparent p-0 shadow-none">
                        <MenubarMenu>
                            <MenubarTrigger className="h-7 rounded-none px-2 py-0 text-xs font-medium">File</MenubarTrigger>
                            <MenubarContent align="start" sideOffset={2} className="min-w-48 rounded-xl border-white/60 bg-white/85 shadow-xl backdrop-blur">
                                <DownloadXMLButton/>
                            </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger className="h-7 rounded-none px-2 py-0 text-xs font-medium">View</MenubarTrigger>
                            <MenubarContent align="start" sideOffset={2} className="min-w-48 rounded-xl border-white/60 bg-white/85 shadow-xl backdrop-blur">
                                <MenubarItem
                                    onSelect={() => openTiledWindow("Text Input")}
                                    disabled={isWindowOpen("Text Input")}
                                >
                                    Open Text Input
                                </MenubarItem>
                                <MenubarItem
                                    onSelect={() => openTiledWindow("Keypad")}
                                    disabled={isWindowOpen("Keypad")}
                                >
                                    Open Keypad
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger className="h-7 rounded-none px-2 py-0 text-xs font-medium">Functions</MenubarTrigger>
                            <MenubarContent align="start" sideOffset={2} className="min-w-48 rounded-xl border-white/60 bg-white/85 shadow-xl backdrop-blur">
                                <MenubarItem onSelect={() => setShowDerivativeBuilder(true)}>Derivative</MenubarItem>
                                <MenubarItem onSelect={() => setShowIntegralBuilder(true)}>Integral</MenubarItem>
                                <MenubarItem onSelect={() => setShowLogBuilder(true)}>Logarithm</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger className="h-7 rounded-none px-2 py-0 text-xs font-medium">Help</MenubarTrigger>
                            <MenubarContent align="start" sideOffset={2} className="min-w-56 rounded-xl border-white/60 bg-white/85 shadow-xl backdrop-blur">
                                <MenubarItem onSelect={() => setShowHelp(true)}>Get Started</MenubarItem>
                                <MenubarItem asChild>
                                    <a href="https://github.com/open-algebra/Oasis/issues/new/choose">File an Issue</a>
                                </MenubarItem>
                                <MenubarSeparator/>
                                <MenubarLabel>GitHub Repositories</MenubarLabel>
                                <MenubarItem asChild>
                                    <a href="https://github.com/open-algebra/Oasis">OASIS</a>
                                </MenubarItem>
                                <MenubarItem asChild>
                                    <a href="https://github.com/open-algebra/OasisC">OasisC</a>
                                </MenubarItem>
                                <MenubarItem asChild>
                                    <a href="https://github.com/open-algebra/webapp">OASIS Web</a>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                    <Link href={"/"} className={"ml-auto hidden rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground md:block"}>
                        openalgebra.org
                    </Link>
                </div>
            </header>
            <Tiler
                value={windowLayout}
                onChange={setWindowLayout}
                renderTile={renderTile}
            />
        </div>
    </AppStateProvider>)
}
