'use client'

import {useState} from "react";
import Script from "next/script";
import Loading from "@/app/app/loading";
import App from "@/app/app/app";

interface HistoryEntry {
    query: string,
    response: string
    error: boolean
}

interface AppState {
    history: HistoryEntry[]
    currentEntry: number,
}

export default function AppPage() {
    const [oasis, setOasis] = useState(null);

    return (
        <>
            <Script src="/OasisC.js" onLoad={() => setOasis((window as any).Module)}/>
            { oasis ? <App oasis={oasis} /> : <Loading /> }
        </>
    )
}