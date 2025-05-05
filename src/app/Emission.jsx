"use client"

import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const GET_DATA = gql`
query Query($status: MediaStatus, $sort: [MediaSort], $type: MediaType, $isAdult: Boolean){
  Page {
    media (status: $status, sort: $sort, type: $type, isAdult: $isAdult){
      id
      title {
        romaji
        english
      }
      coverImage {
        large
        extraLarge
      }
      nextAiringEpisode {
      episode
        airingAt
      }
      meanScore
    }
  }
}




`;
export default function Emission() {



    const sort = "TRENDING_DESC"
    const isAdult = false
    const type = "ANIME"
    const status = "RELEASING"

    const pathname = usePathname();

    const { data, loading, error } = useQuery(GET_DATA, {
        variables: { type, sort, status, isAdult }
    });


    function useWindowWidth() {
        const [windowWidth, setWindowWidth] = useState(
            typeof window !== "undefined" ? window.innerWidth : 0
        );

        useEffect(() => {
            if (typeof window === "undefined") return; // Prevent SSR execution

            function handleResize() {
                setWindowWidth(window.innerWidth);
            }

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        return windowWidth;
    }



    const windowWidth = useWindowWidth();
    const isMobile = windowWidth >= 1024; // Próg dla urządzeń mobilnych, np. 768px
    const limit = isMobile ? 5 : undefined;

    if (error) return <p>Something went wrong: {error.message}</p>



    return (
        <section className="sMain pokaz">
            <main>
                <div className="showAll">
                    <h2><span>Emission </span>soon</h2>
                    <Link href={"/Browse/emissionAll"}>{!pathname.includes("/Browse/") && <p>View All</p>}</Link>



                </div>
                <br />

                <div className="resultsChuj">

                    {loading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="media-card" >

                                <div className="resultCover resultCover2"></div>
                                <p className="skeleton-text skeleton-textCHUJ2"></p>
                            </div>
                        ))
                    ) : (
                        data?.Page?.media?.slice(0, limit).map((item, index) => {
                            const airingAt = item.nextAiringEpisode?.airingAt;
                            const timeUntilAiring = airingAt
                                ? Math.max(airingAt - Math.floor(Date.now() / 1000), 0) // Time remaining in seconds
                                : null;

                            // Convert time into days, hours, and minutes
                            const days = timeUntilAiring ? Math.floor(timeUntilAiring / 86400) : 0;
                            const hours = timeUntilAiring ? Math.floor((timeUntilAiring % 86400) / 3600) : 0;
                            const minutes = timeUntilAiring ? Math.floor((timeUntilAiring % 3600) / 60) : 0;

                            return (

                                <div key={index} className="media-card">
                                    <Link className="resultCover" href={`/anime/${item.id}`}>
                                        <img className="resultImg" src={item.coverImage.extraLarge} alt={item.title.romaji} />
                                    </Link>

                                    <Link href={`/anime/${item.id}`} className="resultTitle">
                                        <div className="resultCircle">

                                            {
                                                timeUntilAiring !== null ? (
                                                    <p className="chujWdupie" >{`${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`}</p>
                                                ) : (
                                                    <p className="chujWdupie">No information</p>
                                                )
                                            }

                                            <div className="chuj3">

                                                {item.meanScore && <><img src="/images/star.svg" className="star" alt="" />
                                                    <span className="chuj25">{item.meanScore}%</span></>}
                                                <p className="chuj25">Ep</p><span className="krzywychuj">{item.nextAiringEpisode?.episode}</span>
                                            </div>

                                        </div>


                                    </Link>



                                </div>

                            );
                        })
                    )}




                </div>
            </main>
        </section>
    );
}
