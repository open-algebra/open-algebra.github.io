import {
    Button,
    Container,
    Stack
} from "react-bootstrap";
import FullScreenContentWithImage from "@/components/FullScreenContentWithImage";

import {Major_Mono_Display} from "next/font/google";

import OasisExampleImage from "../../public/oasis-example.png"
import OasisWebImage from "../../public/oasis-web.png"
import OasisDesktopImage from "../../public/oasis-desktop.png"
import OasisCExampleImage from "../../public/oasisc-example.png"
import NavigationBar from "@/components/NavigationBar";
import Link from "next/link";
import LaunchOASISWeb from "@/components/LaunchOASISWeb";

export default function Home() {
    return (<main>
        <NavigationBar />
        <section>
            <Stack className={"min-vh-100"}>
                <Stack className="flex-grow-1 justify-content-center" gap={5}>
                    <Container className={"text-center"}>
                        <h1 className={"display-1 text-center text-uppercase"}>Open Algebra Project</h1>
                        <p className={"lead"}>Democratizing Algebraic Computation</p>
                    </Container>
                    <Container>
                        <h2>Mission Statement</h2>
                        <p>The Open Algebra Project is dedicated to democratizing access to powerful
                            mathematical tools by
                            providing free, open-source, and accessible computer algebra software. Our mission is to
                            empower individuals, educators, and researchers worldwide by eliminating barriers to
                            advanced
                            mathematical computation and fostering a collaborative community. Through innovation,
                            inclusivity, and transparency, we strive to enhance mathematical education, facilitate
                            groundbreaking
                            research, and inspire a passion for mathematics in people of all backgrounds.</p>
                    </Container>
                </Stack>
                <div className={"text-secondary py-3 text-center"}>
                    Learn More<br/><i className={"bi-chevron-down"}/>
                </div>
            </Stack>
        </section>
        <section id={"OASIS"}>
            <FullScreenContentWithImage image={OasisExampleImage} className={"text-bg-dark"}>
                <h1>Open Algebra Software for Inferring Solutions</h1>
                <p>At the heart of our offerings is OASIS, the Open Algebra Software for Inferring
                    Solutions. OASIS is a powerful C++ open-source computer algebra library that provides a
                    wide range of algebraic capabilities. Whether you&apos;re solving equations, performing
                    symbolic computations, or manipulating algebraic expressions, Oasis offers the robust
                    functionality you need. Its design emphasizes performance, accuracy, and extensibility,
                    making it an indispensable tool for anyone engaged in mathematical research or
                    education.</p>
                <Stack direction={"horizontal"} gap={3}>
                    <Button variant={"outline-light"} href={"/Oasis"}><i className={'bi-book pe-1'} />API Documentation</Button>
                    <Button variant={"outline-light"} href={"https://github.com/open-algebra/Oasis"}><i className={'bi-github pe-1'} />GitHub Repository</Button>
                </Stack>
            </FullScreenContentWithImage>
        </section>
        <section id={"Web"}>
            <FullScreenContentWithImage image={OasisWebImage}>
                <div>
                    <h1>OASIS Web</h1>
                    <p>OASIS Web is a cutting-edge web application that brings the powerful capabilities of the Oasis
                        library directly to your browser. By leveraging OasisC, a C wrapper for the Oasis library, and
                        compiling it into WebAssembly, OASIS Web allows you to perform complex algebraic computations
                        without the need for any local installations or specialized software.</p>
                    <p>With OASIS Web, you can access the full range of OASIS&apos; features—solving equations,
                        manipulating symbolic expressions, and more—right from your browser, making advanced computer
                        algebra more accessible than ever. Whether you&apos;re a student, educator, or researcher, OASIS
                        Web provides a seamless, intuitive interface to harness the power of computer algebra in a
                        convenient, platform-independent environment.</p>
                    <p>No downloads, no installations—just open your browser and start exploring the world of algebraic
                        computation with OASIS Web.</p>
                    <LaunchOASISWeb />
                </div>
            </FullScreenContentWithImage>
        </section>
        <Container>
            <hr/>
        </Container>
        <section id={"Desktop"}>
            <FullScreenContentWithImage image={OasisDesktopImage}>
                <h1>OASIS Desktop</h1>
                <p>To make the power of OASIS even more accessible, we have developed OASIS Desktop, an open-source
                    desktop application that leverages the capabilities of the Oasis library. OASIS Desktop offers a
                    user-friendly interface that allows you to perform complex algebraic computations without needing to
                    write a single line of code. It&apos;s perfect for educators who want to demonstrate concepts in the
                    classroom, students who are learning algebra, and researchers who need a quick and intuitive way to
                    perform symbolic computations.</p>
                <Button variant={"outline-dark"} href={"https://github.com/open-algebra/gui"}><i className={'bi-github pe-1'} />GitHub Repository</Button>
            </FullScreenContentWithImage>
        </section>
        <section id={"OasisC"}>
            <FullScreenContentWithImage image={OasisCExampleImage} className={"text-bg-dark"}>
                <h1>OasisC</h1>
                <p>For those who prefer working in C, we present OasisC, a C wrapper for the Oasis library.
                    OasisC makes it easy to integrate the powerful features of Oasis into C-based projects.
                    This wrapper ensures that you can benefit from the extensive functionality of Oasis
                    while working within the C programming environment, making it an ideal solution for
                    developers who need to incorporate advanced algebraic capabilities into their
                    applications.</p>
                <Button variant={"outline-light"} href={"https://github.com/open-algebra/OasisC"}><i className={'bi-github pe-1'} /> GitHub Repository</Button>
            </FullScreenContentWithImage>
        </section>
    </main>);
}
