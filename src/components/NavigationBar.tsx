'use client'

import {Button, Container, Nav, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle, NavLink} from "react-bootstrap";
import {useEffect, useRef} from "react";
import * as bootstrap from "bootstrap"
import Link from "next/link";

export default function NavigationBar()
{
    const navBarRef = useRef(null);

    useEffect(() => {
        if (!navBarRef.current || typeof document === "undefined") return;
        new bootstrap.ScrollSpy(document.body, { target: navBarRef.current });
    }, [])

    return (<Navbar expand={"lg"} fixed={"top"} className={"bg-light-subtle"} ref={navBarRef}>
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
                <Link href={"/app"} passHref legacyBehavior>
                    <Button>Open OASIS Web</Button>
                </Link>
            </NavbarCollapse>
        </Container>
    </Navbar>)
}