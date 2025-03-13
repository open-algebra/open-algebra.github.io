'use client'

import {Container, Nav, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle, NavLink} from "react-bootstrap";
import {useEffect, useRef} from "react";
import LaunchOASISWeb from "@/components/LaunchOASISWeb";

export default function NavigationBar()
{
    const navBarRef = useRef(null);

    useEffect(() => {
        if (typeof document === "undefined" || !navBarRef.current) return;
        import("bootstrap").then(bootstrap => {
            new bootstrap.ScrollSpy(document.body, { target: navBarRef.current! });
        })
    }, [])

    return (<Navbar expand={"lg"} sticky={"top"} className={"bg-light-subtle"} ref={navBarRef}>
        <Container>
            <NavbarBrand href={"#"}>Open Algebra</NavbarBrand>
            <NavbarToggle aria-controls="navbar-nav"/>
            <NavbarCollapse id={"navbar-nav"}>
                <Nav variant={"underline"} className={"me-auto"}>
                    <NavLink href={"#OASIS"}>OASIS</NavLink>
                    <NavLink href={"#Web"}>Web</NavLink>
                    <NavLink href={"#Desktop"}>Desktop</NavLink>
                    <NavLink href={"#OasisC"}>OasisC</NavLink>
                </Nav>
                <LaunchOASISWeb/>
            </NavbarCollapse>
        </Container>
    </Navbar>)
}