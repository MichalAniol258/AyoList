"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo, useCallback, memo, useRef } from "react";
import { useQueryContext } from "@/src/app/(main)/components/queryProvider";
import Image from "next/image";
import { Tooltip } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

// Throttled window width hook z optymalizacją dla mobile
function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth;
        }
        return 1024;
    });

    const rafId = useRef(null);

    const handleResize = useCallback(() => {
        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
        }

        rafId.current = requestAnimationFrame(() => {
            setWindowWidth(window.innerWidth);
        });
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        window.addEventListener("resize", handleResize, { passive: true });

        return () => {
            window.removeEventListener("resize", handleResize);
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [handleResize]);

    return windowWidth;
}



// Pomocnicze funkcje - memoizowane
const formatTimeDisplay = (timeUntilAiring) => {
    if (!timeUntilAiring) return "No information";

    const days = Math.floor(timeUntilAiring / 86400);
    const hours = Math.floor((timeUntilAiring % 86400) / 3600);
    const minutes = Math.floor((timeUntilAiring % 3600) / 60);

    return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
};

const formatTimeRemaining = (timeUntilAiring) => {
    if (!timeUntilAiring) return { czas_pozostaly: "No", tekst_pozostaly: "information" };

    const days = Math.floor(timeUntilAiring / 86400);
    const hours = Math.floor((timeUntilAiring % 86400) / 3600);
    const minutes = Math.floor((timeUntilAiring % 3600) / 60);

    if (days > 0) return { czas_pozostaly: days, tekst_pozostaly: days === 1 ? "day" : "days" };
    if (hours > 0) return { czas_pozostaly: hours, tekst_pozostaly: hours === 1 ? "hour" : "hours" };
    return { czas_pozostaly: minutes, tekst_pozostaly: minutes === 1 ? "minute" : "minutes" };
};

const formatFormats = (format) => {
    const formatMap = {
        'TV': 'TV',
        'TV_SHORT': 'TV Short',
        'MOVIE': 'Movie',
        'SPECIAL': 'Special',
        'OVA': 'OVA',
        'ONA': 'ONA',
        'MUSIC': 'Music'
    };
    return [formatMap[format] || format];
};

const getScoreIcon = (score) => {
    if (score >= 75) return "⭐";
    if (score >= 60) return "👍";
    if (score >= 40) return "👎";
    return "❌";
};

// Enhanced hook do optymalizowanego ładowania mediów
const useOptimizedMedia = (data, isMobileView) => {
    const [displayedItems, setDisplayedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);

    const initialBatch = isMobileView ? 4 : 8;
    const loadBatch = isMobileView ? 3 : 6;

    useEffect(() => {
        if (!data?.Page?.media || hasInitialized) return;

        // Załaduj pierwszą partię od razu
        setDisplayedItems(data.Page.media.slice(0, initialBatch));
        setHasInitialized(true);
    }, [data, initialBatch, hasInitialized]);

    // Reset when data changes
    useEffect(() => {
        if (!data?.Page?.media) {
            setDisplayedItems([]);
            setHasInitialized(false);
            return;
        }

        if (hasInitialized) {
            setDisplayedItems(data.Page.media.slice(0, initialBatch));
        }
    }, [data, initialBatch, hasInitialized]);

    const loadMore = useCallback(async () => {
        if (isLoading || !data?.Page?.media) return;

        const currentLength = displayedItems.length;
        const totalLength = data.Page.media.length;

        if (currentLength >= totalLength) return;

        setIsLoading(true);

        // Małe opóźnienie dla płynności na mobile
        await new Promise(resolve => setTimeout(resolve, isMobileView ? 150 : 50));

        setDisplayedItems(prev => {
            const nextItems = data.Page.media.slice(prev.length, prev.length + loadBatch);
            return [...prev, ...nextItems];
        });

        setIsLoading(false);
    }, [data, loadBatch, isMobileView, isLoading, displayedItems.length]);

    const hasMore = displayedItems.length < (data?.Page?.media?.length || 0);

    return { items: displayedItems, hasMore, loadMore, isLoading };
};

// Intersection Observer Hook for load triggers
const useIntersectionObserver = (callback, options = {}) => {
    const [element, setElement] = useState(null);

    useEffect(() => {
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                callback();
            }
        }, {
            threshold: 0.1,
            rootMargin: '100px',
            ...options
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [element, callback, options]);

    return setElement;
};

// Zoptymalizowany EmissionCard
const OptimizedEmissionCard = memo(({ item, index, isMobileView }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const title = item.title?.romaji || 'Anime cover';

    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    return (
        <div className="media-card">
            <Link className="resultCover" href={`/anime/${item.id}`}>
                <Image
                    className={`resultImg ${imageLoaded ? 'loaded' : 'loading'}`}
                    fill
                    style={{ objectFit: "cover" }}
                    src={item.coverImage?.large || item.coverImage?.medium}
                    alt={title}
                    sizes={isMobileView ? "45vw" : "200px"}
                    priority={index < 2}
                    loading={index < 4 ? "eager" : "lazy"}
                    quality={isMobileView ? 60 : 80}
                    onLoad={handleImageLoad}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
            </Link>

            <Link href={`/anime/${item.id}`} className="resultTitle">
                <div className="resultCircle">
                    <p className="chujWdupie">{item.timeDisplay}</p>

                    <div className="chuj3">
                        {item.meanScore && (
                            <>
                                <Image
                                    src="/images/star.svg"
                                    width={20}
                                    height={20}
                                    className="star"
                                    alt="Rating star"
                                    loading="lazy"
                                />
                                <span className="chuj25">{item.meanScore}%</span>
                            </>
                        )}
                        <p className="chuj25">Ep</p>
                        <span className="krzywychuj">
                            {item.nextAiringEpisode?.episode || 'N/A'}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
});

OptimizedEmissionCard.displayName = 'OptimizedEmissionCard';

const SkeletonCard = memo(() => (
    <div className="media-card">
        <div className="resultCover resultCover2"></div>
        <p className="skeleton-text skeleton-textCHUJ2"></p>
    </div>
));

SkeletonCard.displayName = 'SkeletonCard';

// Zoptymalizowany AnimeCard
const OptimizedAnimeCard = memo(({ item, getContent, isMobileView }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const title = item.title?.english || item.title?.romaji;
    const hasMeanScore = item.meanScore !== null;

    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    const CardContent = (
        <div className="media-card">
            <Link className="resultCover" href={`/anime/${item.id}`}>
                <Image
                    className={`resultImg ${imageLoaded ? 'loaded' : 'loading'}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    src={item.coverImage?.large || item.coverImage?.medium}
                    alt={title}
                    priority={false}
                    loading="lazy"
                    quality={isMobileView ? 60 : 80}
                    sizes={isMobileView ? "45vw" : "200px"}
                    onLoad={handleImageLoad}
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
        </div>
    );

    if (isMobileView) {
        return CardContent;
    }

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
                {CardContent}
            </motion.div>
        </Tooltip>
    );
});

OptimizedAnimeCard.displayName = 'OptimizedAnimeCard';

const OptimizedMangaCard = memo(({ item, getTooltipContent, isMobileView }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const title = item.title?.english || item.title?.romaji;
    const hasMeanScore = item.meanScore !== null;

    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    const CardContent = (
        <div className="media-card">
            <Link className="resultCover" href={`/manga/${item.id}`}>
                <Image
                    className={`resultImg ${imageLoaded ? 'loaded' : 'loading'}`}
                    fill
                    style={{ objectFit: "cover" }}
                    src={item.coverImage?.large || item.coverImage?.medium }
                    alt={title}
                    sizes={isMobileView ? "45vw" : "200px"}
                    priority={false}
                    loading="lazy"
                    quality={isMobileView ? 60 : 80}
                    onLoad={handleImageLoad}
                />
            </Link>

            <Link href={`/manga/${item.id}`} className="resultTitle min-h-[46px]">
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
        </div>
    );

    if (isMobileView) {
        return CardContent;
    }

    return (
        <Tooltip
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
                {CardContent}
            </motion.div>
        </Tooltip>
    );
});

OptimizedMangaCard.displayName = 'OptimizedMangaCard';

const SectionHeader = memo(({ title, subtitle, href, showViewAll }) => (
    <div className="showAll">
        <h2><span>{title} </span>{subtitle}</h2>
        {showViewAll && (
            <Link href={href}>
                <p>View All</p>
            </Link>
        )}
    </div>
));

SectionHeader.displayName = 'SectionHeader';

// Enhanced LoadTrigger component
const LoadTrigger = memo(({ onIntersect, sectionId, isMobileView }) => {
    const setTriggerRef = useIntersectionObserver(onIntersect, {
        threshold: 0.1,
        rootMargin: isMobileView ? '50px' : '100px'
    });

    return (
        <div
            ref={setTriggerRef}
            className={`load-trigger load-trigger-${sectionId}`}
            style={{ height: '0px', width: '100%' }}
        />
    );
});

LoadTrigger.displayName = 'LoadTrigger';

// Zoptymalizowany komponent sekcji z progresywnym ładowaniem
const OptimizedSection = memo(({
                                   title,
                                   subtitle,
                                   href,
                                   showViewAll,
                                   loading,
                                   data,
                                   renderCard,
                                   isMobileView,
                                   className = "sMain",
                                   sectionId
                               }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const { items, hasMore, loadMore, isLoading } = useOptimizedMedia(data, isMobileView, sectionId);

    // Visibility observer for the section
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px'
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Callback for load more trigger
    const handleLoadMore = useCallback(() => {
        if (hasMore && !isLoading && isVisible) {
            loadMore();
        }
    }, [hasMore, isLoading, isVisible, loadMore]);

    const skeletonItems = useMemo(() =>
        Array.from({ length: isMobileView ? 4 : 8 }, (_, index) => (
            <SkeletonCard key={`skeleton-${sectionId}-${index}`} />
        )), [isMobileView, sectionId]
    );

    return (
        <section className={className} ref={sectionRef}>
            <main>
                <SectionHeader
                    title={title}
                    subtitle={subtitle}
                    href={href}
                    showViewAll={showViewAll}
                />
                <br />

                <div className="resultsChuj">
                    {loading || !isVisible ? (
                        skeletonItems
                    ) : (
                        <>
                            {items.map((item, index) => renderCard(item, index))}
                            {hasMore && (
                                <LoadTrigger
                                    onIntersect={handleLoadMore}
                                    sectionId={sectionId}
                                    isMobileView={isMobileView}
                                />
                            )}

                        </>
                    )}
                </div>
            </main>
        </section>
    );
});

OptimizedSection.displayName = 'OptimizedSection';

function OptimizedEmissionComponent() {
    const {
        dataEmission, loadingEmission, errorEmission,
        dataSeason, loadingSeason, season, seasonYear,
        dataNext, loadingNext,
        dataManga, loadingManga,
        dataPopular, loadingPopular
    } = useQueryContext();

    const pathname = usePathname();
    const windowWidth = useWindowWidth();
    const isMobileView = windowWidth <= 768;


    const {
        items: emissionMedia,
        hasMore: hasMoreEmission,
        loadMore: loadMoreEmission,
        isLoading: isLoadingEmission
    } = useOptimizedMedia(dataEmission, isMobileView, 'emission');

    // Intersection observer for emission load trigger
    const handleEmissionLoadMore = useCallback(() => {
        if (hasMoreEmission && !isLoadingEmission) {
            loadMoreEmission();
        }
    }, [hasMoreEmission, isLoadingEmission, loadMoreEmission]);

    // Memoizacja danych emission z czasem
    const emissionDisplayData = useMemo(() => {
        if (!emissionMedia.length) return [];

        return emissionMedia.map((item) => {
            const airingAt = item.nextAiringEpisode?.airingAt;
            const timeUntilAiring = airingAt
                ? Math.max(airingAt - Math.floor(Date.now() / 1000), 0)
                : null;

            return {
                ...item,
                timeDisplay: formatTimeDisplay(timeUntilAiring)
            };
        });
    }, [emissionMedia]);

    // Sprawdzenie czy pokazać "View All"
    const shouldShowViewAll = useMemo(() =>
        !pathname.includes("/Browse/"), [pathname]
    );

    // Throttled callback dla tooltip content
    const getContent = useCallback((item) => {
        if (isMobileView) return null;

        const airingAt = item.nextAiringEpisode?.airingAt;
        const timeUntilAiring = airingAt
            ? Math.max(airingAt - Math.floor(Date.now() / 1000), 0)
            : null;

        const {czas_pozostaly, tekst_pozostaly} = formatTimeRemaining(timeUntilAiring);
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
                                    <>Ep {item.nextAiringEpisode.episode} airing
                                        in {czas_pozostaly} {tekst_pozostaly}</>
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
    }, [isMobileView]);

    // Callback dla manga tooltip
    const getTooltipContent = useCallback((item) => {
        if (isMobileView) return null;

        const filteredFormats = formatFormats(item.format);

        return (
            <div className="hover-data-right">
                <div className="hover-header">
                    <div className="date airing">
                        {item.startDate?.year ? (
                            item.status === "FINISHED" && item.endDate?.year ?
                                `${item.startDate.year} - ${item.endDate.year}` :
                                `${item.startDate.year}`
                        ) : "TBA"}
                    </div>
                    <div className="hover-score">
                        {getScoreIcon(item.meanScore)}
                        <span className="percentage">
                            {item.meanScore}{item.meanScore !== null && "%"}
                        </span>
                    </div>
                </div>
                <div className="hover-info">
                    <span>{filteredFormats.join(", ")}</span>
                    <span className="separator">{item.chapters && "•"}</span>
                    <span>
                        {item.chapters && `${item.chapters} chapters`}
                        {item.volumes && ` • ${item.volumes} volumes`}
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
    }, [isMobileView]);

    // Render functions with index support
    const renderEmissionCard = useCallback((item, index) => (
        <OptimizedEmissionCard
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            isMobileView={isMobileView}
        />
    ), [isMobileView]);

    const renderAnimeCard = useCallback((item, index) => (
        <OptimizedAnimeCard
            key={`${item.id}-${index}`}
            item={item}
            getContent={getContent}
            isMobileView={isMobileView}
        />
    ), [getContent, isMobileView]);

    const renderMangaCard = useCallback((item, index) => (
        <OptimizedMangaCard
            key={`${item.id}-${index}`}
            item={item}
            getTooltipContent={getTooltipContent}
            isMobileView={isMobileView}
        />
    ), [getTooltipContent, isMobileView]);

    const skeletonItems = useMemo(() =>
        Array.from({length: isMobileView ? 4 : 8}, (_, index) => (
            <SkeletonCard key={`skeleton-emission-${index}`}/>
        )), [isMobileView]
    );

    // Error handling
    if (errorEmission) {
        return (
            <section className="sMain pokaz">
                <main>
                    <div className="error-container">
                        <p>Something went wrong: {errorEmission.message}</p>
                    </div>
                </main>
            </section>
        );
    }

    return (
        <AnimatePresence mode="wait">
            {/* Emission Section z progresywnym ładowaniem */}
            <section className="sMain pokaz">
                <main>
                    <SectionHeader
                        title="Emission"
                        subtitle="soon"
                        href="/Browse/emissionAll"
                        showViewAll={shouldShowViewAll}
                    />
                    <br/>

                    <div className="resultsChuj">
                        {loadingEmission ? (
                            skeletonItems
                        ) : (
                            <>
                                {emissionDisplayData.map(renderEmissionCard)}
                                {hasMoreEmission && (
                                    <LoadTrigger
                                        onIntersect={handleEmissionLoadMore}
                                        sectionId="emission"
                                        isMobileView={isMobileView}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </main>
            </section>

            {/* Pozostałe sekcje z optymalizacją */}
            <OptimizedSection
                title={season}
                subtitle={`${seasonYear} Anime`}
                href="/Browse/seasonalAll"
                showViewAll={shouldShowViewAll}
                loading={loadingSeason}
                data={dataSeason}
                renderCard={renderAnimeCard}
                isMobileView={isMobileView}
                className="sMain"
                sectionId="season"
            />

            <OptimizedSection
                title="Popular"
                subtitle="now"
                href="/Browse/popularAll"
                showViewAll={shouldShowViewAll}
                loading={loadingPopular}
                data={dataPopular}
                renderCard={renderAnimeCard}
                isMobileView={isMobileView}
                className="sMain"
                sectionId="popular"
            />

            <OptimizedSection
                title="Up"
                subtitle="coming"
                href="/Browse/upcomingAll"
                showViewAll={shouldShowViewAll}
                loading={loadingNext}
                data={dataNext}
                renderCard={renderAnimeCard}
                isMobileView={isMobileView}
                className="sMain"
                sectionId="upcoming"
            />

            <OptimizedSection
                title="Popular"
                subtitle="Manga"
                href="/Browse/popularManga"
                showViewAll={shouldShowViewAll}
                loading={loadingManga}
                data={dataManga}
                renderCard={renderMangaCard}
                isMobileView={isMobileView}
                className="sMain"
                sectionId="popularManga"
            />
        </AnimatePresence>
    )
}

export default OptimizedEmissionComponent;
