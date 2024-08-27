import {StaticImport} from "next/dist/shared/lib/get-img-props";
import React, {HTMLProps} from "react";
import {Col, Container, Row, Stack} from "react-bootstrap";
import Image from "next/image";

export default function FullScreenContentWithImage({ image, children, ...props }: { image: StaticImport } & HTMLProps<HTMLDivElement>) {
    return (<div {...props}>
        <Container>
            <Row xs={1} lg={2} className={"min-vh-100"}>
                <Col>
                    <Stack className={"h-100 justify-content-center"}>
                        <div className={"py-5"}>
                            {children}
                        </div>
                    </Stack>
                </Col>
                <Col className={"d-none d-lg-block"}>
                    <Stack className={"h-100 justify-content-center"}>
                        <Image className={"h-100 w-100 object-fit-contain"} src={image}
                               alt={"OASIS Code Example"}/>
                    </Stack>
                </Col>
                <Col className={"d-lg-none"}>
                    <Stack className={"justify-content-center"}>
                        <Image className={"h-100 w-100 object-fit-contain"} src={image}
                               alt={"OASIS Code Example"}/>
                    </Stack>
                </Col>
            </Row>
        </Container>
    </div>)
}