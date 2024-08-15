import {Spinner, Stack} from "react-bootstrap";

export default function Loading() {
    return (
        <Stack className={"align-items-center justify-content-center vh-100"} gap={3}>
            <Spinner/>
            <h1 className={"mx-3"}>Hold on! Paradise is on its way!</h1>
        </Stack>
    );
}