import Image from "next/image";
import FullScreenContentWithImage from "@/components/FullScreenContentWithImage";
import NavigationBar from "@/components/NavigationBar";
import LaunchOASISWeb from "@/components/LaunchOASISWeb";
import { ButtonLink } from "@/components/ui/button";

import OasisExampleImage from "../../public/oasis-example.png"
import OasisWebImage from "../../public/oasis-web.png"
import OasisDesktopImage from "../../public/oasis-desktop.png"
import OasisCExampleImage from "../../public/oasisc-example.png"
import BigCat from "../../public/big-cat.svg"

export default function Home() {
    return (<main>
        <NavigationBar />
        <section>
            <div className="full-height flex flex-col">
                <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-12 px-6 py-12 lg:px-8">
                    <Image src={BigCat} alt={"big cat"} className={"mx-auto h-auto w-1/2 max-w-lg"} loading={"eager"} />
                    <div className={"text-center"}>
                        <h1 className={"text-5xl font-black uppercase tracking-tight md:text-7xl"}>Open Algebra Project</h1>
                        <p className={"mt-3 text-xl text-muted-foreground"}>Democratizing Algebraic Computation</p>
                    </div>
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-3 text-2xl font-semibold">Mission Statement</h2>
                        <p className="text-lg leading-8 text-muted-foreground">The Open Algebra Project is dedicated to democratizing access to powerful
                            mathematical tools by
                            providing free, open-source, and accessible computer algebra software. Our mission is to
                            empower individuals, educators, and researchers worldwide by eliminating barriers to
                            advanced
                            mathematical computation and fostering a collaborative community. Through innovation,
                            inclusivity, and transparency, we strive to enhance mathematical education, facilitate
                            groundbreaking
                            research, and inspire a passion for mathematics in people of all backgrounds.</p>
                    </div>
                </div>
                <div className={"py-4 text-center text-sm font-medium text-muted-foreground"}>
                    Learn More<br/>v
                </div>
            </div>
        </section>
        <section id={"OASIS"}>
            <FullScreenContentWithImage image={OasisExampleImage} className={"bg-slate-950 text-white"}>
                <h1 className="text-4xl font-bold tracking-tight">Open Algebra Software for Inferring Solutions</h1>
                <p className="leading-7 text-slate-200">At the heart of our offerings is OASIS, the Open Algebra Software for Inferring
                    Solutions. OASIS is a powerful C++ open-source computer algebra library that provides a
                    wide range of algebraic capabilities. Whether you&apos;re solving equations, performing
                    symbolic computations, or manipulating algebraic expressions, Oasis offers the robust
                    functionality you need. Its design emphasizes performance, accuracy, and extensibility,
                    making it an indispensable tool for anyone engaged in mathematical research or
                    education.</p>
                <div className="flex flex-wrap gap-3">
                    <ButtonLink variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" href={"/Oasis"}>API Documentation</ButtonLink>
                    <ButtonLink variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" href={"https://github.com/open-algebra/Oasis"}>GitHub Repository</ButtonLink>
                </div>
            </FullScreenContentWithImage>
        </section>
        <section id={"Web"}>
            <FullScreenContentWithImage image={OasisWebImage}>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">OASIS Web</h1>
                    <p className="mt-5 leading-7 text-muted-foreground">OASIS Web is a cutting-edge web application that brings the powerful capabilities of the Oasis
                        library directly to your browser. By leveraging OasisC, a C wrapper for the Oasis library, and
                        compiling it into WebAssembly, OASIS Web allows you to perform complex algebraic computations
                        without the need for any local installations or specialized software.</p>
                    <p className="leading-7 text-muted-foreground">With OASIS Web, you can access the full range of OASIS&apos; features—solving equations,
                        manipulating symbolic expressions, and more—right from your browser, making advanced computer
                        algebra more accessible than ever. Whether you&apos;re a student, educator, or researcher, OASIS
                        Web provides a seamless, intuitive interface to harness the power of computer algebra in a
                        convenient, platform-independent environment.</p>
                    <p className="leading-7 text-muted-foreground">No downloads, no installations—just open your browser and start exploring the world of algebraic
                        computation with OASIS Web.</p>
                    <LaunchOASISWeb />
                </div>
            </FullScreenContentWithImage>
        </section>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <hr/>
        </div>
        <section id={"Desktop"}>
            <FullScreenContentWithImage image={OasisDesktopImage}>
                <h1 className="text-4xl font-bold tracking-tight">OASIS Desktop</h1>
                <p className="leading-7 text-muted-foreground">To make the power of OASIS even more accessible, we have developed OASIS Desktop, an open-source
                    desktop application that leverages the capabilities of the Oasis library. OASIS Desktop offers a
                    user-friendly interface that allows you to perform complex algebraic computations without needing to
                    write a single line of code. It&apos;s perfect for educators who want to demonstrate concepts in the
                    classroom, students who are learning algebra, and researchers who need a quick and intuitive way to
                    perform symbolic computations.</p>
                <ButtonLink variant="outline" href={"https://github.com/open-algebra/gui"}>GitHub Repository</ButtonLink>
            </FullScreenContentWithImage>
        </section>
        <section id={"OasisC"}>
            <FullScreenContentWithImage image={OasisCExampleImage} className={"bg-slate-950 text-white"}>
                <h1 className="text-4xl font-bold tracking-tight">OasisC</h1>
                <p className="leading-7 text-slate-200">For those who prefer working in C, we present OasisC, a C wrapper for the Oasis library.
                    OasisC makes it easy to integrate the powerful features of Oasis into C-based projects.
                    This wrapper ensures that you can benefit from the extensive functionality of Oasis
                    while working within the C programming environment, making it an ideal solution for
                    developers who need to incorporate advanced algebraic capabilities into their
                    applications.</p>
                <ButtonLink variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" href={"https://github.com/open-algebra/OasisC"}>GitHub Repository</ButtonLink>
            </FullScreenContentWithImage>
        </section>
    </main>);
}
