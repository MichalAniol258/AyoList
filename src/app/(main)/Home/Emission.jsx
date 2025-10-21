"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useQueryContext } from "@/src/app/(main)/components/queryProvider";
import Image from "next/image";

// Custom hook dla szerokości okna z debouncing - wyciągnięty poza komponent
function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth;
        }
        return 1024; // Domyślna wartość dla SSR
    });

    const handleResize = useCallback(() => {
        setWindowWidth(window.innerWidth);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Zwiększony debounce delay dla lepszej wydajności
        let timeoutId;
        const debouncedHandleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 150);
        };

        window.addEventListener("resize", debouncedHandleResize);
        return () => {
            window.removeEventListener("resize", debouncedHandleResize);
            clearTimeout(timeoutId);
        };
    }, [handleResize]);

    return windowWidth;
}

// Funkcja pomocnicza do formatowania czasu - wyciągnięta poza komponent
const formatTimeDisplay = (timeUntilAiring) => {
    if (!timeUntilAiring) return "No information";

    const days = Math.floor(timeUntilAiring / 86400);
    const hours = Math.floor((timeUntilAiring % 86400) / 3600);
    const minutes = Math.floor((timeUntilAiring % 3600) / 60);

    return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
};

// Wydzielony komponent pojedynczego elementu emission
const EmissionCard = memo(({ item, index }) => {
    const title = item.title?.romaji || 'Anime cover';

    return (
        <div className="media-card">
            <Link className="resultCover" href={`/anime/${item.id}`}>
                <Image
                    className="resultImg"
                    fill
                    style={{ objectFit: "cover" }}
                    src={item.coverImage?.extraLarge || '/images/placeholder.jpg'}
                    alt={title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3} // Priorytet dla pierwszych 3 obrazów
                    loading={index < 3 ? "eager" : "lazy"}
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

EmissionCard.displayName = 'EmissionCard';

// Wydzielony komponent skeleton
const SkeletonCard = memo(() => (
    <div className="media-card">
        <div className="resultCover resultCover2"></div>
        <p className="skeleton-text skeleton-textCHUJ2"></p>
    </div>
));

SkeletonCard.displayName = 'SkeletonCard';

function EmissionComponent() {
    const { dataEmission, loadingEmission, errorEmission } = useQueryContext();
    const pathname = usePathname();
    useWindowWidth();

    // Memoizacja podstawowych wartości - bez limitu, pokazuj wszystkie
    const media = useMemo(() => dataEmission?.Page?.media || [], [dataEmission]);

    // Memoizacja danych do wyświetlenia z optymalizacją
    const displayData = useMemo(() => {
        if (!media.length) return [];

        return media.map((item) => {
            const airingAt = item.nextAiringEpisode?.airingAt;
            const timeUntilAiring = airingAt
                ? Math.max(airingAt - Math.floor(Date.now() / 1000), 0)
                : null;

            return {
                ...item,
                timeDisplay: formatTimeDisplay(timeUntilAiring)
            };
        });
    }, [media]);

    // Memoizacja skeleton items z optymalizacją
    const skeletonItems = useMemo(() =>
        Array.from({ length: 8 }, (_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
        )), []
    );

    // Sprawdzenie czy należy pokazać "View All" - memoizowane
    const shouldShowViewAll = useMemo(() =>
        !pathname.includes("/Browse/"), [pathname]
    );

    // Early return dla błędu
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
        <section className="sMain pokaz">
            <main>
                <div className="showAll">
                    <h2><span>Emission </span>soon</h2>
                    {shouldShowViewAll && (
                        <Link href="/Browse/emissionAll">
                            <p>View All</p>
                        </Link>
                    )}
                </div>
                <br />

                <div className="resultsChuj">
                    {loadingEmission ? (
                        skeletonItems
                    ) : (
                        displayData.map((item, index) => (
                            <EmissionCard
                                key={`${item.id}-${index}`}
                                item={item}
                                index={index}
                            />
                        ))
                    )}
                </div>
            </main>
        </section>
    );
}


const emission = memo(EmissionComponent);

export default emission;
