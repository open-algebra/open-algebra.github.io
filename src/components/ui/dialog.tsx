"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Dialog({
    open,
    onOpenChange,
    children,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
            role="presentation"
            onMouseDown={() => onOpenChange(false)}
        >
            <div onMouseDown={(event) => event.stopPropagation()}>{children}</div>
        </div>
    );
}

export function DialogContent({
    className,
    children,
    onClose,
}: {
    className?: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    return (
        <div
            className={cn(
                "relative w-full max-w-lg rounded-xl border bg-background p-6 text-foreground shadow-lg",
                className,
            )}
            role="dialog"
            aria-modal="true"
        >
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3"
                onClick={onClose}
                aria-label="Close"
            >
                x
            </Button>
            {children}
        </div>
    );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("mb-4 space-y-1.5", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
}
