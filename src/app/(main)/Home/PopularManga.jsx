"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import {useEffect, useState, useMemo, useCallback, memo} from "react";
import { useQueryContext } from '@/src/app/(main)/components/queryProvider';
import Image from "next/image";

// Move hook outside component to avoid recreation
function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 0
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => setWindowWidth(window.innerWidth);

        // Throttle resize events for better performance
        let timeoutId;
        const throttledResize = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 100);
        };

        window.addEventListener("resize", throttledResize);
        return () => {
            window.removeEventListener("resize", throttledResize);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    return windowWidth;
}

// Move SVG items outside component to avoid recreation
const SVG_ITEMS = [
    {
        icon: (
            <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="var(--green)" className="hover-Image">
                <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"></path>
            </svg>
        )
    },
    {
        icon: (
            <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="var(--orange)" className="hover-Image">
                <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm8 144H160c-13.2 0-24 10.8-24 24s10.8 24 24 24h176c13.2 0 24-10.8 24-24s-10.8-24-24-24z"></path>
            </svg>
        )
    },
    {
        icon: (
            <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="var(--red)" className="hover-Image">
                <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z"></path>
            </svg>
        )
    }
];

// Move format mapping outside component
const FORMAT_MAP = {
    "ONE_SHOT": "One shot",
    "MANGA": "Manga",
    "TV": "TV Show",
    "NOVEL": "Novel"
};

function PopularMangaComponent() {
    const { dataManga, loadingManga, errorManga } = useQueryContext();
    const pathname = usePathname();
    const windowWidth = useWindowWidth();

    // Memoize calculated values
    const isMobile = useMemo(() => windowWidth >= 1024, [windowWidth]);
    const limit = useMemo(() => isMobile ? 5 : undefined, [isMobile]);

    // Memoize media data
    const media = useMemo(() => dataManga?.Page?.media || [], [dataManga]);

    // Memoize time calculation function
    const calculateTimeRemaining = useCallback((airingAt) => {
        if (!airingAt) return null;

        const timeUntilAiring = Math.max(airingAt - Math.floor(Date.now() / 1000), 0);
        const days = Math.floor(timeUntilAiring / 86400);
        const remainingSeconds = timeUntilAiring % 86400;
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        if (days > 0) return { value: days, unit: days === 1 ? 'day' : 'days' };
        if (hours > 0) return { value: hours, unit: hours === 1 ? 'hour' : 'hours' };
        if (minutes > 0) return { value: minutes, unit: minutes === 1 ? 'minute' : 'minutes' };
        if (seconds > 0) return { value: seconds, unit: seconds === 1 ? 'second' : 'seconds' };

        return null;
    }, []);

    // Memoize format processing
    const processFormats = useCallback((format) => {
        const formats = Array.isArray(format) ? format : [format];
        return formats
            .filter((f) => typeof f === "string" && f.trim())
            .map((f) => FORMAT_MAP[f] || f);
    }, []);

    // Memoize content function with useCallback
    const getTooltipContent = useCallback((item) => {
        const timeRemaining = calculateTimeRemaining(item.nextAiringEpisode?.airingAt);
        const movie = item.duration;
        const movieHours = movie ? Math.floor(movie / 60) : 0;
        const remainingMovie = movie ? movie % 60 : 0;
        const filteredFormats = processFormats(item.format);

        const renderDateInfo = () => {
            if (item.status !== "FINISHED") {
                if (item.startDate?.year === null) return "TBA";
                if (item.nextAiringEpisode && timeRemaining) {
                    return `Ep ${item.nextAiringEpisode.episode} airing in ${timeRemaining.value} ${timeRemaining.unit}`;
                }
                if (item.status === "RELEASING" && item.startDate?.year < 2000) {
                    return `Publishing Since ${item.startDate?.year}`;
                }
                const season = item.season
                    ? `${item.season.charAt(0).toUpperCase()}${item.season.slice(1).toLowerCase()}`
                    : "";
                const publishingText = item.status !== "NOT_YET_RELEASED"
                    ? `Publishing Since ${item.startDate?.year}`
                    : `${item.startDate?.year}`;
                return `${season} ${publishingText}`;
            } else {
                if (item.endDate?.year) {
                    if (item.episodes > 100) {
                        return `${item.startDate?.year}-${item.endDate?.year}`;
                    }
                    const season = item.season
                        ? `${item.season.charAt(0).toUpperCase()}${item.season.slice(1).toLowerCase()}`
                        : "";
                    return `${season} ${item.startDate?.year}-${item.endDate?.year}`;
                }
                return "TBA";
            }
        };

        const renderScoreIcon = () => {
            if (item.meanScore >= 75) return SVG_ITEMS[0].icon;
            if (item.meanScore >= 60) return SVG_ITEMS[1].icon;
            if (item.meanScore !== null) return SVG_ITEMS[2].icon;
            return null;
        };

        const renderEpisodeInfo = () => {
            if (item.episodes > 1) return `${item.episodes} episodes`;
            if (item.episodes === 1 && item.format !== "MOVIE") return "1 episode";
            if (item.format === "MOVIE" && item.episodes === 1) {
                const hourText = movieHours > 0 ? `${movieHours} ${movieHours > 1 ? "hours" : "hour"}` : "";
                const minText = remainingMovie > 0 ? `${remainingMovie} ${remainingMovie > 1 ? "mins" : "min"}` : "";
                return [hourText, minText].filter(Boolean).join(", ");
            }
            return "";
        };

        const renderSeparator = () => {
            const parts = [];
            if (item.episodes !== null) parts.push("•");
            if (item.status === "FINISHED" && item.chapters) {
                parts.push(`• ${item.chapters} chapters`);
            }
            return parts.join(" ");
        };

        return (
            <div className="hover-data-right">
                <div className="hover-header">
                    <div className="date airing">{renderDateInfo()}</div>
                    <div className="hover-score">
                        {renderScoreIcon()}
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
                    <span className="separator">{renderSeparator()}</span>
                    <span>{renderEpisodeInfo()}</span>
                </div>
                <div className="hover-genres">
                    {item.genres?.slice(0, 3).map((genre) => (
                        <div className="genre" key={genre}>
                            {genre}
                        </div>
                    ))}
                </div>
            </div>
        );
    }, [calculateTimeRemaining, processFormats]);

    // Memoize displayed media
    const displayedMedia = useMemo(() => {
        return limit ? media.slice(0, limit) : media;
    }, [media, limit]);

    if (errorManga) {
        return <p>Something went wrong: {errorManga.message}</p>;
    }

    return (
        <section className="sMain pokaz">
            <main>
                <div className="showAll">
                    <h2><span>Popular </span>Manga</h2>
                    <Link href="/Browse/popularManga">
                        {!pathname.includes("/Browse/") && <p>View All</p>}
                    </Link>
                </div>
                <br />

                <div className="resultsChuj">
                    {loadingManga ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="media-card">
                                <div className="resultCover resultCover2"></div>
                                <p className="skeleton-text skeleton-textCHUJ2"></p>
                            </div>
                        ))
                    ) : (
                        displayedMedia.map((item) => (
                            <Tooltip
                                key={item.id}
                                showArrow={true}
                                placement="right-start"
                                closeDelay={150}
                                delay={50}
                                color="foreground"
                                content={getTooltipContent(item)}
                                offset={30}
                                style={{ zIndex: "1" }}
                            >
                                <motion.div className="media-card">
                                    <Link className="resultCover" href={`/manga/${item.id}`}>
                                        <Image
                                            className="resultImg"
                                            fill
                                            style={{ objectFit: "cover" }}
                                            src={item.coverImage.extraLarge}
                                            alt={item.title.romaji}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority={false}
                                        />
                                    </Link>

                                    <Link href={`/manga/${item.id}`} className="resultTitle min-h-[46px]">
                                        <div className="resultCircle">
                                            {item.title?.english || item.title?.romaji}
                                        </div>
                                    </Link>

                                    {item.meanScore !== null && (
                                        <div className="flex justify-start items-center gap-1">
                                            <Image
                                                width={20}
                                                height={20}
                                                src="/images/star.svg"
                                                className="star"
                                                alt=""
                                            />
                                            <span className="text-[0.8rem]">
                                                {item.meanScore}%
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            </Tooltip>
                        ))
                    )}
                </div>
            </main>
        </section>
    );
}

const PopularManga = memo(PopularMangaComponent);

export default PopularManga;
