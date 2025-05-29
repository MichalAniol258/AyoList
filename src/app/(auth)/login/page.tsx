"use client"
import Image from "next/image";
import {useRouter} from "next/navigation";
export default function LoginPage() {
    const router = useRouter();



    const loginToAniList = () => {
        router.push("/api/auth/anilist"); // Endpoint autoryzacji AniList
    };
    return (
        <div className="containerLogin">

            <button onClick={loginToAniList} className="buttonChuj">
                <Image src={`/images/AniList_logo.png`} width={25} className="loginImg" height={25} alt="chu" unoptimized />
                Sign in with Anilist
            </button>
        </div>
    )
}
