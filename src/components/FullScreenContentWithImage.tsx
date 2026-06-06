import {StaticImport} from "next/dist/shared/lib/get-img-props";
import React, {HTMLProps} from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function FullScreenContentWithImage({ image, children, ...props }: { image: StaticImport } & HTMLProps<HTMLDivElement>) {
    return (<div {...props} className={cn("min-h-screen", props.className)}>
        <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8">
            <div className="max-w-2xl space-y-5">
                {children}
            </div>
            <div className="flex items-center justify-center">
                <Image className="h-auto max-h-[72vh] w-full object-contain" src={image} alt="OASIS Code Example"/>
            </div>
        </div>
    </div>)
}
