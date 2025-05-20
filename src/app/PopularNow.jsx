"use client"
import {useQueryContext} from "@/src/app/components/queryProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PopularNow() {
    const {dataPopular, loadingPopular, errorPopular} = useQueryContext();
    const pathname = usePathname();

    const data = dataPopular;
    const loading = loadingPopular;
    const error = errorPopular;





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

    const media = data?.Page?.media;


    const svgItems = [
        {
            icon: (
                <svg data-v-4d8937d6="" aria-hidden="true" focusable="false" data-prefix="far" data-icon="smile" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="var(--green)" className="hover-Image"><path data-v-4d8937d6="" fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"></path></svg>
            )
        },
        {
            icon: (
                <svg data-v-4d8937d6="" aria-hidden="true" focusable="false" data-prefix="far" data-icon="meh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="var(--orange)" className="hover-Image"><path data-v-4d8937d6="" fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm8 144H160c-13.2 0-24 10.8-24 24s10.8 24 24 24h176c13.2 0 24-10.8 24-24s-10.8-24-24-24z"></path></svg>
            )
        },
        {
            icon: (
                <svg data-v-4d8937d6="" aria-hidden="true" focusable="false" data-prefix="far" data-icon="frown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="var(--red)" className="hover-Image"><path data-v-4d8937d6="" fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z"></path></svg>
            )
        }
    ]

    const content = (item) => {
        const airingAt = item.nextAiringEpisode?.airingAt;
        const timeUntilAiring = airingAt
            ? Math.max(airingAt - Math.floor(Date.now() / 1000), 0) // Time remaining in seconds
            : null;

        // Convert time into days, hours, and minutes
        const days = timeUntilAiring ? Math.floor(timeUntilAiring / 86400) : 0;


        const remainingSeconds = timeUntilAiring ? timeUntilAiring % 86400 : 0;

        const hours = Math.floor(remainingSeconds / 3600); // Liczba godzin
        const minutes = Math.floor((remainingSeconds % 3600) / 60); // Liczba minut
        const seconds = remainingSeconds % 60; // Liczba sekund

        let czas_pozostaly = '';
        let tekst_pozostaly = ''
        if (days > 0) {
            czas_pozostaly = days
            tekst_pozostaly = days === 1 ? 'day' : 'days'
        } else if (days === 0 && hours > 0) {
            czas_pozostaly = hours
            tekst_pozostaly = hours === 1 ? 'hour' : 'hours'
        } else if (days === 0 && hours === 0 && minutes > 0) {
            czas_pozostaly = minutes
            tekst_pozostaly = minutes === 1 ? 'minute' : 'minutes'
        } else if (days === 0 && hours === 0 && minutes === 0 && seconds > 0) {
            czas_pozostaly = seconds
            tekst_pozostaly = seconds === 1 ? 'second' : 'seconds'
        }
        const movie = item.duration;
        const movieHours = Math.floor(movie / 60);
        const remainingMovie = movie % 60;
        const formats = Array.isArray(item.format) ? item.format : [item.format];

        const filteredFormats = formats
            .filter((format) => typeof format === "string" && format !== "")
            .map((format2) =>
                format2
                    .replace("ONE_SHOT", "One shot")
                    .replace("MANGA", "Manga")
                    .replace("TV", "TV Show")
                    .replace("NOVEL", "Novel")
            );





        return (
            // Dodano return
            <div className="hover-data-right">
                <div className="hover-header">
                    <div className="date airing">
                        {(item.status !== "FINISHED") ? (
                            item.startDate?.year === null ? (<>TBA</>) :
                                item.nextAiringEpisode ? (
                                    // Jeśli anime ma status "Releasing" i są dostępne informacje o nowym odcinku
                                    (<>Ep {item.nextAiringEpisode.episode} airing in {czas_pozostaly} {tekst_pozostaly}</>)
                                ) : (
                                    (item.status === "RELEASING" && item.startDate?.year < 2000) ? (

                                        <>{`Airing Since ${item.startDate?.year}`}
                                        </>

                                    ) : (
                                        <> {item.season
                                            ? `${item.season.charAt(0).toUpperCase()}${item.season.slice(1).toLowerCase()}`
                                            : ""} {`${item.startDate?.year}`}</>
                                    )


                                )

                        ) : (
                            // Jeśli anime nie ma statusu "Releasing"
                            (item.endDate?.year ? // Jeśli anime zakończone i ma więcej niż 100 odcinków
                                (item.episodes > 100 ? (<>{item.startDate?.year}-{item.endDate?.year}</>) : (<> {item.season
                                    ? `${item.season.charAt(0).toUpperCase()}${item.season.slice(1).toLowerCase()}`
                                    : ""} {`${item.startDate?.year}`}</>)) : // Jeśli brak informacji o sezonie i startDate
                                (<>TBA</>))
                        )}
                    </div>


                    <div className="hover-score">
                        {item.meanScore >= 75 && svgItems[0].icon}
                        {(item.meanScore <= 74 && item.meanScore >= 60) && svgItems[1].icon}
                        {(item.meanScore <= 59 && item.meanScore !== null) && svgItems[2].icon}
                        <span className="percentage">{item.meanScore}{item.meanScore !== null && "%"}</span>
                    </div>
                </div>
                <div className="hover-studios">
                    <span>{item.studios?.edges?.[0]?.node?.name}</span>
                </div>
                <div className="hover-info">
                    <span>{filteredFormats}</span>
                    <span className="separator">{item.episodes !== null && "•"}</span>
                    <span>
                        {item.episodes > 1 && item.episodes + " episodes "}
                        {(item.episodes === 1 && item.format !== "MOVIE") && " episode"}
                        {item.format === "MOVIE" && item.episodes === 1 &&
                            (movieHours > 0 ? movieHours + `${movieHours > 1 ? " hours" : " hour"}` : "") +
                            (movieHours > 0 && remainingMovie > 0 ? ", " : "") +
                            (remainingMovie > 0 ? `${remainingMovie} ${remainingMovie > 1 ? "mins" : "min"}` : "")}
                    </span>
                </div>
                <div className="hover-genres">
                    {item.genres?.slice(0, 3).map((genre, index) => (
                        <div className="genre" key={index}>
                            {genre}
                        </div>
                    ))}
                </div>
            </div >
        );
    };

    return (
        <section className="sMain pokaz">
            <main>
                <div className="showAll">
                    <h2><span>Popular </span>now</h2>
                    <Link href={"/Browse/popularAll"}>{!pathname.includes("/Browse/") && <p>View All</p>}</Link>



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
                        media.slice(0, limit).map((item) => {
                            return (
                                <Tooltip
                                    key={item.id}
                                    showArrow={true}
                                    placement="right-start"
                                    closeDelay={150}
                                    delay={50}
                                    color="foreground"
                                    content={content(item)}
                                    offset={30}
                                    style={{
                                        zIndex: "1",
                                    }}
                                >
                                    <motion.div className="media-card" key={item.id}>
                                        <Link className="resultCover" href={`/anime/${item.id}`}>
                                            <img className="resultImg" src={item.coverImage.extraLarge} alt={item.title.romaji} />
                                        </Link>

                                        <Link href={`/anime/${item.id}`} className="resultTitle min-h-[46px]">
                                            <div className="resultCircle">
                                                {item.title?.english === null ? item.title?.romaji : item.title?.english}

                                            </div>

                                        </Link>
                                        {item.meanScore !== null &&<div className="flex justify-start items-center gap-1">
                                            <img src="/images/star.svg" className="star" alt="" />
                                            {item.meanScore !== null && <span className="text-[0.8rem]">{item.meanScore}{item.meanScore !== null && "%"}</span>}
                                        </div>}

                                    </motion.div>
                                </Tooltip>
                            )
                        })
                    )}
                </div>
            </main>
        </section>
    );
}
