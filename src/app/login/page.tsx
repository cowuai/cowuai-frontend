import Image from "next/image";

export default function LoginPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <div className={"flex flex-row width-full max-w p-4 bg-white rounded-lg"}>
                <Image src={"/images/cowuai-logo.png"} alt={"CowUai Logo"} width={500} height={500} className={"self-center mb-4"}/>
                <div className="flex flex-col gap-8 items-center bg-red-900 rounded-lg p-4 text-white">
                    <h2 className="text-2xl font-bold">Login</h2>
                </div>
            </div>
        </main>
    );
}