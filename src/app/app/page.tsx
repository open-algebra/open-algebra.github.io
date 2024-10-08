'use client'

import {useEffect, useState} from "react";
import Loading from "@/app/app/loading";
import App from "@/app/app/app/app";
import loadOasis from "@/app/app/OasisC";

export default function AppPage() {
    const [oasis, setOasis] = useState();
    useEffect(() => { loadOasis().then(oasis => setOasis(oasis)); }, []);

    return oasis ? <App oasis={oasis} /> : <Loading />;
}