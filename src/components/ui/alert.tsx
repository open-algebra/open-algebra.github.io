import * as React from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            role="alert"
            className={cn("relative w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950", className)}
            {...props}
        />
    );
}
