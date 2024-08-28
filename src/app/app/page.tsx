import Loading from "@/app/app/loading";
import App from "@/app/app/app";
import {Suspense} from "react";

export default function AppPage() {
    return (
        <Suspense fallback={<Loading />}>
            <App />
        </Suspense>
    )
}