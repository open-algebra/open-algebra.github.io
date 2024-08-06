import {Container, Stack} from "react-bootstrap";

export default function Home() {
    return (
        <main>
            <Stack className="min-vh-100 justify-content-center">
                <Container>
                    <h1 className={"fw-semibold display-1"}>Open Algebra Project</h1>
                    <p className={"lead"}>The Open Algebra Project is dedicated to democratizing access to powerful mathematical tools by
                        providing free, open-source, and accessible computer algebra software. Our mission is to empower
                        individuals, educators, and researchers worldwide by eliminating barriers to advanced mathematical
                        computation and fostering a collaborative community. Through innovation, inclusivity, and
                        transparency, we strive to enhance mathematical education, facilitate groundbreaking research, and
                        inspire a passion for mathematics in people of all backgrounds.</p>
                </Container>
            </Stack>
        </main>
    );
}
