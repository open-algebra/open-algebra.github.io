'use client'

import {Toast, ToastBody, ToastContainer, ToastHeader} from "react-bootstrap";
import {useState} from "react";

export default function CookieDisclaimer()
{
    const [showCookieState, setShowCookieState] = useState<boolean>(true)

    return (<ToastContainer className={"p-3 z-4 position-fixed"} position={"bottom-end"}>
        <Toast show={showCookieState} onClose={() => setShowCookieState(false)}>
            <ToastHeader><span className={"me-auto"}>Cookie Statement</span></ToastHeader>
            <ToastBody>
                We use Microsoft Clarity, which uses cookies, to better understand how you use this website.
                For more information, see the <a href={"https://privacy.microsoft.com/privacystatement"}>Microsoft
                Privacy Statement</a>.</ToastBody>
        </Toast>
    </ToastContainer>)
}