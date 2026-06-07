export default function Loading() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-3 px-3">
            <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <h1 className="text-center text-2xl font-semibold">Hold on! Paradise is on its way!</h1>
        </div>
    );
}
