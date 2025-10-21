"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


import {useQueryContext} from "/src/app/(main)/components/queryProvider";
export default function StatsGenres() {
    const { statsData, statsLoading, mediaData, mediaLoading } = useQueryContext();
    const pathname = usePathname();
    const type = pathname.includes("/Profile/Stats/Anime/") ? 'anime' : 'manga';
    const statistics = statsData?.User?.statistics || [];
    const [isSwitch4, setSwitch4] = useState("switch");
    const rawData = statistics[type]; // Pobranie danych przed mapowaniem

    if (statsLoading) return <h1>loading...</h1>
    if (mediaLoading) return <h1>loading...</h1>



    const media = mediaData?.MediaListCollection?.lists?.flatMap(list => list.entries) || []




    function isFunctionSwitch4(switchId) {
        setSwitch4(switchId)
    }
    return (
        <>

            <div className="statsMainScore">
                <div className="headerScore">
                    <h3 className="!text-[1.612rem]">Genres</h3>
                    <div className="scoreSwitch !text-[0.93rem]">
                        <div className={`optionScore ${isSwitch4 === 'switch' ? "scoreActive" : ""} `} >
                            <span className="" onClick={() => isFunctionSwitch4('switch')}>
                                Count
                            </span>
                        </div>

                        <div className={`optionScore ${isSwitch4 === 'switch2' ? "scoreActive" : ""}`}>
                            <span onClick={() => isFunctionSwitch4('switch2')}>
                                Mean Score
                            </span>
                        </div>

                        <div className={`optionScore ${isSwitch4 === 'switch3' ? "scoreActive" : ""}`}>
                            <span onClick={() => isFunctionSwitch4('switch3')}>
                                {(pathname.includes("/Profile/Stats/Anime/") ? 'Time Watched' : 'Chapters Read')}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
            <div className="stat-cards">
                {rawData?.genres?.map((item, index) => {


                    const minutesWatched = item.minutesWatched;
                    const days = Math.floor(minutesWatched / 60 / 24);
                    const hours = Math.floor((minutesWatched / 60) % 24);

                    return (

                        <div key={index} className="stat-card">
                            <div className="titleStat">
                                <Link href={''} className="" >{item.genre}</Link>
                            </div>
                            <div className="count circle2">{index + 1}</div>
                            <div className="">
                                <div className="inner-wrap">
                                    <div className="details flex justify-between">
                                        <div className="detail">
                                            <div className="p-b-[5px] font-bold text-[1.125rem]">{item.count}</div>
                                            <div className="font-medium text-[0.875rem] text-[#7c899a]">Count</div>
                                        </div>

                                        <div className="detail">
                                            <div className="p-b-[5px] font-bold text-[1.125rem]">{item.meanScore}</div>
                                            <div className="font-medium text-[0.875rem] text-[#7c899a]">Mean Score</div>
                                        </div>

                                        <div className="detail">
                                            <div className="p-b-[5px] font-bold text-[1.125rem]">  {days ? `${days} ${days === 1 ? 'day' : 'days'}` : ''} {hours ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : ''} </div>
                                            <div className="font-medium text-[0.875rem] text-[#7c899a]">Time Watched</div>
                                        </div>
                                    </div>
                                    <div className="relations-wrap">
                                        <div className="relations-inner-wrap">
                                            <div className="relations2">
                                                {media
                                                    .filter((item2) => item2.media?.genres?.includes(item.genre))
                                                    .map((item3) => (
                                                        <div key={index} className="relation-card">
                                                            <Link
                                                                className="image"
                                                                style={{
                                                                    backgroundImage: `url('${item3.media?.coverImage?.extraLarge}')`
                                                                }}
                                                                href={''}
                                                            ></Link>
                                                        </div>
                                                    ))}


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    )
                })}
            </div>
        </>
    );
}
