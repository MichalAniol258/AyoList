"use client"
import StatsGenres from "../../../pStatsGenres";
import {useLayoutContext} from "@/src/app/components/context";

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
