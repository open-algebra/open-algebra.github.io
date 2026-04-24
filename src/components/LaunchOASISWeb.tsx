import Link from "next/link";

export default function LaunchOASISWeb() {
    return <Link href={"/app"} className={"btn btn-primary"}>
        Launch OASIS Web <i className={"bi-rocket-takeoff ps-1"}/>
    </Link>;
}
