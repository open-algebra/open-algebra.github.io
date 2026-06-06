'use client'

import {useState} from "react";
import { Button } from "@/components/ui/button";

export default function CookieDisclaimer()
{
    const [showCookieState, setShowCookieState] = useState<boolean>(true)

    if (!showCookieState) return null;

    return (
        <aside className="fixed bottom-4 right-4 z-40 max-w-sm rounded-xl border bg-card p-4 text-card-foreground shadow-lg">
            <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">Cookie Statement</h2>
                <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => setShowCookieState(false)} aria-label="Close cookie statement">
                    x
                </Button>
            </div>
            <p className="text-sm text-muted-foreground">
                We use Microsoft Clarity, which uses cookies, to better understand how you use this website.
                For more information, see the <a className="font-medium text-primary underline-offset-4 hover:underline" href={"https://privacy.microsoft.com/privacystatement"}>Microsoft
                Privacy Statement</a>.
            </p>
        </aside>
    )
}
