'use client'

import {useEffect, useState} from "react";
import { Menu } from "lucide-react";
import LaunchOASISWeb from "@/components/LaunchOASISWeb";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const links = [
    { href: "#OASIS", label: "OASIS" },
    { href: "#Web", label: "Web" },
    { href: "#Desktop", label: "Desktop" },
    { href: "#OasisC", label: "OasisC" },
];

export default function NavigationBar()
{
    const [activeId, setActiveId] = useState("OASIS");

    useEffect(() => {
        const sections = links
            .map(({ href }) => document.getElementById(href.slice(1)))
            .filter((section): section is HTMLElement => Boolean(section));

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible?.target.id) setActiveId(visible.target.id);
            },
            { rootMargin: "-25% 0px -55% 0px" },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    return (
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-6 lg:px-8">
                <a className="text-base font-semibold tracking-tight" href="#">Open Algebra</a>
                <NavigationMenu className="hidden flex-1 justify-start lg:flex">
                    <NavigationMenuList>
                        {links.map(({ href, label }) => (
                            <NavigationMenuItem key={href}>
                                <NavigationMenuLink
                                    href={href}
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        "bg-transparent text-muted-foreground",
                                        activeId === href.slice(1) && "bg-accent text-accent-foreground",
                                    )}
                                >
                                    {label}
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="ml-auto hidden lg:block">
                    <LaunchOASISWeb/>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="ml-auto lg:hidden" aria-label="Open navigation">
                            <Menu className="size-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>Open Algebra</SheetTitle>
                        </SheetHeader>
                        <nav className="mt-8 flex flex-col gap-2">
                            {links.map(({ href, label }) => (
                                <SheetClose asChild key={href}>
                                    <a
                                        href={href}
                                        className={cn(
                                            "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                            activeId === href.slice(1) && "bg-accent text-accent-foreground",
                                        )}
                                    >
                                        {label}
                                    </a>
                                </SheetClose>
                            ))}
                            <div className="pt-4">
                                <SheetClose asChild>
                                    <a href="/app" className={buttonVariants()}>Launch OASIS Web</a>
                                </SheetClose>
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
