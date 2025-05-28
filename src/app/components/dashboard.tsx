"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
const Dashboard = () => {
    const router = useRouter();

    /* const [userInfo, setUserInfo] = useState<UserInfo>(null);

     useEffect(() => {
         const userInfoCookie = getCookie("userInfo");

         if (userInfoCookie) {
             try {
                 const parsedUserInfo = JSON.parse(userInfoCookie as string);
                 setUserInfo(parsedUserInfo);
             } catch (err) {
                 console.error("Failed to parse userInfo cookie:", err);
             }
         }
     }, []);
     */

    const loginToAniList = () => {
        router.push("/api/auth/anilist"); // Endpoint autoryzacji AniList
    };

    return (
        <>
            <div className="containerLogin">

                <button onClick={loginToAniList} className="buttonChuj">
                    <Image src={`/images/AniList_logo.png`} width={25} className="loginImg" height={25} alt="chu" unoptimized />
                    Sign in with Anilist
                </button>
            </div>
        </>
    );
};

export default Dashboard;
