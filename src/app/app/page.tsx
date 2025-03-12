'use client'

import {useEffect, useState} from "react";
import Loading from "@/app/app/loading";
import App from "@/app/app/app/app";
import loadOasis, {MainModule} from "@open-algebra/oasis/oasis-web";

export default function AppPage() {
    const [oasis, setOasis] = useState<MainModule | null>(null);
    useEffect(() => { loadOasis().then(oasis => setOasis(oasis)); }, []);

    return oasis ? <App oasis={oasis} /> : <Loading />;
}