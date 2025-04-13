"use client"
import StatsGenres from "../../../pStatsGenres"
import { useLayoutContext } from "../../layout";
export default function StatsOverview() {
    const { statsData, statsLoading, mediaData, mediaLoading } = useLayoutContext()

    return (
        <>
            <section className="pAnimelistMain">
                <StatsGenres statsData={statsData} mediaData={mediaData} mediaLoading={mediaLoading} statsLoading={statsLoading} />
            </section>

        </>
    );
}
