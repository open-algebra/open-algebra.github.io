import {Button, Card, CardBody, CardText, CardTitle, Col, Container, Row, Stack} from "react-bootstrap";
import Link from "next/link";

export default function Home() {
    return (
        <main>
            <Stack className="min-vh-100 justify-content-center">
                <Container className={"my-5"}>
                    <h1 className={"fw-semibold display-1"}>Open Algebra Project</h1>
                    <p className={"lead"}>The Open Algebra Project is dedicated to democratizing access to powerful
                        mathematical tools by
                        providing free, open-source, and accessible computer algebra software. Our mission is to empower
                        individuals, educators, and researchers worldwide by eliminating barriers to advanced
                        mathematical
                        computation and fostering a collaborative community. Through innovation, inclusivity, and
                        transparency, we strive to enhance mathematical education, facilitate groundbreaking research,
                        and
                        inspire a passion for mathematics in people of all backgrounds.</p>
                    <h1>Projects</h1>
                    <p>The following is a list of projects that constitute the Open Algebra Project:</p>
                    <Row className={"g-3"}>
                        <Col md={6} lg={3}>
                            <Card className={"h-100"}>
                                <CardBody as={Stack}>
                                    <CardTitle>OASIS</CardTitle>
                                    <CardText>Open Algebra Software for Inferring Solutions (OASIS) is a C++ library for
                                        embedding computer algebra and symbolic manipulation.</CardText>
                                    <div className={"flex-grow-1"}/>
                                    <Button href={"https://github.com/open-algebra/Oasis"} variant={"dark"}>GitHub
                                        Repository</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={6} lg={3}>
                            <Card className={"h-100"}>
                                <CardBody as={Stack}>
                                    <CardTitle>OasisC</CardTitle>
                                    <CardText>OasisC is a C wrapper for the OASIS library.</CardText>
                                    <div className={"flex-grow-1"}/>
                                    <Button href={"https://github.com/open-algebra/OasisC"} variant={"dark"}>GitHub
                                        Repository</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={6} lg={3}>
                            <Card className={"h-100"}>
                                <CardBody as={Stack}>
                                    <CardTitle>OASIS Desktop</CardTitle>
                                    <CardText>OASIS Desktop is a frontend graphical user interface for OASIS that runs
                                        locally.</CardText>
                                    <div className={"flex-grow-1"}/>
                                    <Button href={"https://github.com/open-algebra/gui"} variant={"dark"}>GitHub
                                        Repository</Button>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={6} lg={3}>
                            <Card className={"h-100"}>
                                <CardBody as={Stack}>
                                    <CardTitle>OASIS Web</CardTitle>
                                    <CardText>OASIS Web is a frontend graphical user interface for OASIS that runs in
                                        your browser.</CardText>
                                    <div className={"flex-grow-1"}/>
                                    <Stack gap={2}>
                                        <Link href={"/app"} passHref legacyBehavior>
                                            <Button variant={"primary"}>Go to Oasis Web</Button>
                                        </Link>
                                        <Button href={"https://github.com/open-algebra/webapp"} variant={"dark"}>GitHub
                                            Repository</Button>
                                    </Stack>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Stack>
        </main>
    );
}
