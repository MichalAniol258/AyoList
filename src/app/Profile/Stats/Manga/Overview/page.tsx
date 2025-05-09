"use client"
import PStats from "../../../pStats.jsx"
import {useLayoutContext} from "@/src/app/components/context";
export default function StatsOverview() {
    const { statsData, statsLoading } = useLayoutContext();

    return (
        <>
            <section className="pAnimelistMain">
                <PStats statsData={statsData} statsLoading={statsLoading}></PStats>
            </section>

        </>
    );
}
