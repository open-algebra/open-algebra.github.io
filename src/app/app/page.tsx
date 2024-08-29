'use client'

import {useEffect, useState} from "react";
import Loading from "@/app/app/loading";
import App from "@/app/app/app";

export default function AppPage() {
    const [oasis, setOasis] = useState();

    useEffect(() => {
        import("./OasisC")
            .then(loadOasis => loadOasis.default())
            .then(oasis => setOasis(oasis));
    }, []);

    return oasis ? <App oasis={oasis} /> : <Loading />;
}