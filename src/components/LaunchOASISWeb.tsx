import Link from "next/link";
import {Button} from "react-bootstrap";

export default function LaunchOASISWeb() {
    return <Link href={"/app"} passHref legacyBehavior>
        <Button>Launch OASIS Web <i className={"bi-rocket-takeoff ps-1"}/></Button>
    </Link>;
}