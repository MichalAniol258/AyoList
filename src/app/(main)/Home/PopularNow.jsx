"use client";
import { useQueryContext } from "@/src/app/(main)/components/queryProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import Image from "next/image";

// SVG ikony wyciągnięte jako stałe poza komponent
const SVG_ITEMS = [
    {
        icon: (
            <svg
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
                color="var(--green)"
                className="hover-Image"
            >
                <path
                    fill="currentColor"
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"
                />
            </svg>
        )
    },
    {
        icon: (
            <svg
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
                color="var(--orange)"
                className="hover-Image"
            >
                <path
                    fill="currentColor"
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm8 144H160c-13.2 0-24 10.8-24 24s10.8 24 24 24h176c13.2 0 24-10.8 24-24s-10.8-24-24-24z"
                />
            </svg>
        )
    },
    {
        icon: (
            <svg
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
                color="var(--red)"
                className="hover-Image"
            >
                <path
                    fill="currentColor"
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z"
                />
            </svg>
        )
    }
];

// Hook do window width z debouncing zamiast throttling dla lepszej wydajności
function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        let timeoutId;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setWindowWidth(window.innerWidth);
            }, 150); // Zwiększony debounce delay
        };

        window.addEventListener("resize", debouncedResize);
        return () => {
            window.removeEventListener("resize", debouncedResize);
            clearTimeout(timeoutId);
        };
    }, []);

    return windowWidth;
}

// Funkcja pomocnicza do formatowania czasu - bez zmian
const formatTimeRemaining = (timeUntilAiring) => {
    if (!timeUntilAiring) return { czas_pozostaly: '', tekst_pozostaly: '' };

    const days = Math.floor(timeUntilAiring / 86400);
    const remainingSeconds = timeUntilAiring % 86400;
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    if (days > 0) {
        return { czas_pozostaly: days, tekst_pozostaly: days === 1 ? 'day' : 'days' };
    } else if (hours > 0) {
        return { czas_pozostaly: hours, tekst_pozostaly: hours === 1 ? 'hour' : 'hours' };
    } else if (minutes > 0) {
        return { czas_pozostaly: minutes, tekst_pozostaly: minutes === 1 ? 'minute' : 'minutes' };
    } else if (seconds > 0) {
        return { czas_pozostaly: seconds, tekst_pozostaly: seconds === 1 ? 'second' : 'seconds' };
    }
    return { czas_pozostaly: '', tekst_pozostaly: '' };
};

// Funkcja pomocnicza do formatowania formatów - bez zmian
const formatFormats = (formats) => {
    const formatArray = Array.isArray(formats) ? formats : [formats];
    return formatArray
        .filter(format => format && typeof format === 'string' && format.trim())
        .map(format =>
            format
                .replace("ONE_SHOT", "One shot")
                .replace("MANGA", "Manga")
                .replace("TV", "TV Show")
                .replace("NOVEL", "Novel")
        );
};

// Funkcja pomocnicza do renderowania ikony oceny - bez zmian
const getScoreIcon = (meanScore) => {
    if (meanScore >= 75) return SVG_ITEMS[0].icon;
    if (meanScore >= 60) return SVG_ITEMS[1].icon;
    if (meanScore !== null && meanScore <= 59) return SVG_ITEMS[2].icon;
    return null;
};

// Wydzielony komponent pojedynczego elementu anime
const AnimeCard = memo(({ item, getContent }) => {
    const title = item.title?.english || item.title?.romaji;
    const hasMeanScore = item.meanScore !== null;

    return (
        <Tooltip
            showArrow={true}
            placement="right-start"
            closeDelay={150}
            delay={50}
            color="foreground"
            content={getContent(item)}
            offset={30}
            style={{ zIndex: "1" }}
        >
            <motion.div className="media-card">
                <Link className="resultCover" href={`/anime/${item.id}`}>
                    <Image
                        className="resultImg"
                        fill
                        style={{ objectFit: 'cover' }}
                        src={item.coverImage.extraLarge}
                        alt={title}
                        priority={false}
                        loading="lazy"
                    />
                </Link>

                <Link href={`/anime/${item.id}`} className="resultTitle min-h-[46px]">
                    <div className="resultCircle">
                        {title}
                    </div>
                </Link>

                {hasMeanScore && (
                    <div className="flex justify-start items-center gap-1">
                        <Image
                            width={20}
                            height={20}
                            src="/images/star.svg"
                            className="star"
                            alt=""
                            loading="lazy"
                        />
                        <span className="text-[0.8rem]">
                            {item.meanScore}%
                        </span>
                    </div>
                )}
            </motion.div>
        </Tooltip>
    );
});

AnimeCard.displayName = 'AnimeCard';

function PopularNowComponent() {
    const { dataPopular, loadingPopular, errorPopular } = useQueryContext();
    const pathname = usePathname();
    const windowWidth = useWindowWidth();

    // Memoizacja podstawowych wartości
    const media = useMemo(() => dataPopular?.Page?.media || [], [dataPopular]);
    const isMobile = useMemo(() => windowWidth >= 1024, [windowWidth]);
    const limit = useMemo(() => isMobile ? 5 : undefined, [isMobile]);

    // Stabilna referencia funkcji getContent
    const getContent = useCallback((item) => {
        const airingAt = item.nextAiringEpisode?.airingAt;
        const timeUntilAiring = airingAt
            ? Math.max(airingAt - Math.floor(Date.now() / 1000), 0)
            : null;

        const { czas_pozostaly, tekst_pozostaly } = formatTimeRemaining(timeUntilAiring);

        const movie = item.duration || 0;
        const movieHours = Math.floor(movie / 60);
        const remainingMovie = movie % 60;
        const filteredFormats = formatFormats(item.format);

        return (
            <div className="hover-data-right">
                <div className="hover-header">
                    <div className="date airing">
                        {(item.status !== "FINISHED") ? (
                            item.startDate?.year === null ? (<>TBA</>) :
                                item.nextAiringEpisode ? (
                                    <>Ep {item.nextAiringEpisode.episode} airing in {czas_pozostaly} {tekst_pozostaly}</>
                                ) : (
                                    (item.status === "RELEASING" && item.startDate?.year < 2000) ? (
                                        <>{`Airing Since ${item.startDate?.year}`}</>
                                    ) : (
                                        <> {item.season
                                            ? `${item.season.charAt(0).toUpperCase()}${item.season.slice(1).toLowerCase()}`
                                            : ""} {`${item.startDate?.year}`}</>
                                    )
                                )
                        ) : (
                            (item.endDate?.year ?
                                (item.episodes > 100 ? (<>{item.startDate?.year}-{item.endDate?.year}</>) :
                                    (<> {item.season
                                        ? `${item.season.charAt(0).toUpperCase()}${item.season.slice(1).toLowerCase()}`
                                        : ""} {`${item.startDate?.year}`}</>)) :
                                (<>TBA</>))
                        )}
                    </div>

                    <div className="hover-score">
                        {getScoreIcon(item.meanScore)}
                        <span className="percentage">
                            {item.meanScore}{item.meanScore !== null && "%"}
                        </span>
                    </div>
                </div>
                <div className="hover-studios">
                    <span>{item.studios?.edges?.[0]?.node?.name}</span>
                </div>
                <div className="hover-info">
                    <span>{filteredFormats.join(", ")}</span>
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
            </div>
        );
    }, []);

    // Memoizacja mediów z limitem
    const displayedMedia = useMemo(() => {
        return limit ? media.slice(0, limit) : media;
    }, [media, limit]);

    // Early return dla błędu
    if (errorPopular) return <p>Something went wrong: {errorPopular.message}</p>;

    return (
        <section className="sMain pokaz">
            <main>
                <div className="showAll">
                    <h2>
                        <span>Popular </span>now
                    </h2>
                    <Link href="/Browse/popularAll">
                        {!pathname.includes("/Browse/") && <p>View All</p>}
                    </Link>
                </div>

                <br />

                <div className="resultsChuj">
                    {loadingPopular ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="media-card">
                                <div className="resultCover resultCover2"></div>
                                <p className="skeleton-text skeleton-textCHUJ2"></p>
                            </div>
                        ))
                    ) : (
                        displayedMedia.map((item) => (
                            <AnimeCard
                                key={item.id}
                                item={item}
                                getContent={getContent}
                            />
                        ))
                    )}
                </div>
            </main>
        </section>
    );
}

const PopularNow = memo(PopularNowComponent);

export default PopularNow;
