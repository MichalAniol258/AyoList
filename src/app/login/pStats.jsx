"use client"
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tooltip } from "@heroui/react";
const animeList = [
    {
        name: "Overview",
        path: "/Profile/Stats/Anime/Overview"
    },
    {
        name: "Genres",
        path: "/Profile/Stats/Anime/Genres"
    },
    {
        name: "Tags",
        path: "/Profile/Stats/Anime/Tags"
    },
    {
        name: "Voice Actors",
        path: "/Profile/Stats/Anime/Voice-actors"
    },
    {
        name: "Studios",
        path: "/Profile/Stats/Anime/Studios"
    },
    {
        name: "Staff",
        path: "/Profile/Stats/Anime/Staff"
    },
]

const mangaList = [
    {
        name: "Overview",
        path: "/Profile/Stats/Manga/Overview"
    },
    {
        name: "Genres",
        path: "/Profile/Stats/Manga/Genres"
    },
    {
        name: "Tags",
        path: "/Profile/Stats/Manga/Tags"
    },
    {
        name: "Staff",
        path: "/Profile/Stats/Manga/Staff"
    },
]

const mangaOption = [
    {
        name: "Total Manga",
        value: 46,
        icon: () => (
            <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="book" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"></path></svg>
        )

    },
    {
        name: "Chapters Read",
        value: 5262,
        icon: () => (
            <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bookmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"></path></svg>
        )
    },
    {
        name: "Volumes Read",
        value: 157,
        icon: () => (
            <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="book-open" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64 2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49 69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43 30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73 87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0 62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11 218.77 46.95 10.62 5.35 23.21-1.94 23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z"></path></svg>
        )
    },
    {
        name: "Mean Score",
        value: 87.5,
        icon: () => (
            <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="percentage" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M109.25 173.25c24.99-24.99 24.99-65.52 0-90.51-24.99-24.99-65.52-24.99-90.51 0-24.99 24.99-24.99 65.52 0 90.51 25 25 65.52 25 90.51 0zm256 165.49c-24.99-24.99-65.52-24.99-90.51 0-24.99 24.99-24.99 65.52 0 90.51 24.99 24.99 65.52 24.99 90.51 0 25-24.99 25-65.51 0-90.51zm-1.94-231.43l-22.62-22.62c-12.5-12.5-32.76-12.5-45.25 0L20.69 359.44c-12.5 12.5-12.5 32.76 0 45.25l22.62 22.62c12.5 12.5 32.76 12.5 45.25 0l274.75-274.75c12.5-12.49 12.5-32.75 0-45.25z"></path></svg>
        )
    },
    {
        name: "Standard  Devitation",
        value: 9.3,
        icon: () => (
            <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="divide" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M224 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm0-192c35.35 0 64-28.65 64-64s-28.65-64-64-64-64 28.65-64 64 28.65 64 64 64zm192 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
        )
    }
]

const animeOption = [
    {
        name: "Total Anime",
        value: 312,
        icon: () => (
            <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tv" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M592 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h245.1v32h-160c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-160v-32H592c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-16 352H64V64h512v288z"></path></svg>
        )
    },
    {
        name: "Episodes Watched",
        value: 6863,
        icon: () => (
            <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>
        )
    },
    {
        name: "Days Watched",
        value: 114.6,
        icon: () => (
            <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path></svg>
        )
    },
    {
        name: "Days Planned",
        value: 1.9,
        icon: () => (
            <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="hourglass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M360 64c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24 0 90.965 51.016 167.734 120.842 192C75.016 280.266 24 357.035 24 448c-13.255 0-24 10.745-24 24v16c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24 0-90.965-51.016-167.734-120.842-192C308.984 231.734 360 154.965 360 64z"></path></svg>
        )
    },
    {
        name: "Mean Score",
        value: 80.74,
        icon: () => (
            <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="percentage" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M109.25 173.25c24.99-24.99 24.99-65.52 0-90.51-24.99-24.99-65.52-24.99-90.51 0-24.99 24.99-24.99 65.52 0 90.51 25 25 65.52 25 90.51 0zm256 165.49c-24.99-24.99-65.52-24.99-90.51 0-24.99 24.99-24.99 65.52 0 90.51 24.99 24.99 65.52 24.99 90.51 0 25-24.99 25-65.51 0-90.51zm-1.94-231.43l-22.62-22.62c-12.5-12.5-32.76-12.5-45.25 0L20.69 359.44c-12.5 12.5-12.5 32.76 0 45.25l22.62 22.62c12.5 12.5 32.76 12.5 45.25 0l274.75-274.75c12.5-12.49 12.5-32.75 0-45.25z"></path></svg>
        )
    },
    {
        name: "Standard Devitation",
        value: 9.7,
        icon: () => (
            <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="divide" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M224 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm0-192c35.35 0 64-28.65 64-64s-28.65-64-64-64-64 28.65-64 64 28.65 64 64 64zm192 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
        )
    }
]

const animeSwitch = [
    {
        name: "Titles Watched"
    },
    {
        name: "Hours Watched"
    }
]

const mangaSwitch = [
    {
        name: "Titles Read"
    },
    {
        name: "Chapters Read"
    }
]

export default function PAnimeListMain() {

    let pathname = usePathname() || "/";

    if (pathname === "/Profile/Stats") {
        pathname = "/Profile/Stats/Anime/Overview"
    }






    const [isToggle, setToggle] = useState(false);


    function handleToggle() {
        setToggle(!isToggle)
    }

    const [isON, setON] = useState(true);

    function isFunction() {
        setON(true)
        setON2(false)
    }

    const [isON2, setON2] = useState(false);

    function isFunction2() {
        setON2(true)
        setON(false)
    }


    const [isSwitch, setSwitch] = useState(true);

    function isFunctionSwitch() {
        setSwitch(true)
        setSwitch2(false)
        setSwitch3(false)
    }

    const [isSwitch2, setSwitch2] = useState(false);

    function isFunctionSwitch2() {
        setSwitch(false)
        setSwitch2(true)
        setSwitch3(false)
    }

    const [isSwitch3, setSwitch3] = useState(false);

    function isFunctionSwitch3() {
        setSwitch(false)
        setSwitch2(false)
        setSwitch3(true)
    }

    const [isSwitch4, setSwitch4] = useState("siemano");

    function isFunctionSwitch4(switchId) {
        setSwitch4(switchId)

    }

    const [isSwitch5, setSwitch5] = useState("cosik");

    function isFunctionSwitch5(switchId) {
        setSwitch5(switchId)

    }








    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [hoveredIndex2, setHoveredIndex2] = useState(null)

    const statsH3Anime = [
        {
            name: "Episode Count"
        }
    ]

    const statsH3Manga = [
        {
            name: "Chapter Count"
        }
    ]

    const statsSwitchAnime = [
        {
            name: "Titles Watched"
        },
        {
            name: "Hours Watched"
        },
        {
            name: "Mean Score"
        }
    ]

    const statsSwitchManga = [
        {
            name: "Titles Read"
        },
        {
            name: "Chapters Read"
        },
        {
            name: "Mean Score"
        }
    ]

    const statsSwitchYear = [
        {
            name: "Watch Year"
        },
        {
            name: "Read Year"
        }
    ]




    const [isOpen, setOpen] = useState(null);

    const handleToolTipOpen = (tooltipId) => {
        setOpen(tooltipId)
    }



    const handleToolTipClose = () => {
        setOpen(null)
    }

    const content = (

        <div className="tooltipDiv">
            <div className="tooltipTitle">Score: 9</div>
            <div className="tooltipContent">
                <div>Count: 5</div>
                <div>Chapters Read: 1065</div>
                <div>Mean Score: 90</div>
            </div>
        </div>

    )





    return (


        <>
            <div className="contentContainer">
                <div className="all all2">
                    <div className="contentWhole">
                        <div className="content2">
                            <p>Youngjamal&apos;s Stats</p>
                        </div>

                        <div className={`contentFilter ${isToggle ? 'buttonActive' : 'buttonNoActive'}`} onClick={() => handleToggle()}
                        >
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                                preserveAspectRatio="xMidYMid meet" className={`filterIcon`}>
                                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                    fill="currentColor" stroke="none">
                                    <path d="M500 3184 c-234 -50 -436 -254 -485 -489 -95 -454 306 -855 760 -760
288 60 505 329 505 625 0 406 -380 710 -780 624z"/>
                                    <path d="M2420 3184 c-234 -50 -436 -254 -485 -489 -95 -454 306 -855 760
-760 238 50 440 252 490 490 95 456 -309 857 -765 759z"/>
                                    <path d="M4340 3184 c-234 -50 -436 -254 -485 -489 -95 -454 306 -855 760
-760 238 50 440 252 490 490 95 456 -309 857 -765 759z"/>
                                </g>
                            </svg>
                        </div>

                        <div className={`listContainer ${isToggle ? 'buttonActive' : 'buttonNoActive'}`}>
                            <div className="group">
                                <div className="list list2">
                                    <p>Anime Stats</p>
                                </div>

                                {animeList.map((item, index) => {
                                    const isActive = item.path === pathname;
                                    const isHovered = hoveredIndex2 === index;

                                    const transitionVariants = {
                                        active: { backgroundColor: '#111e22', color: "rgb(149, 164, 185)" },
                                        inactive: { backgroundColor: 'rgba(17, 30, 34, 0)', color: "rgb(124, 137, 154)" },
                                        hovered: { backgroundColor: "#111e22" }
                                    };

                                    return (
                                        <Link href={item.path} key={item.path}>
                                            <motion.div
                                                className={`${pathname === "/Profile/Animelist" ? "listOption" : "listOption listOption2"} ${isActive ? 'optionActive2' : ''}`}
                                                initial="inactive"
                                                animate={isHovered ? 'hovered' : isActive ? 'active' : 'inactive'}
                                                variants={transitionVariants}
                                                onMouseOver={() => setHoveredIndex2(index)}
                                                onMouseOut={() => setHoveredIndex2(null)}
                                                transition={{ duration: 0, ease: 'easeInOut' }}
                                            >
                                                {item.name}
                                            </motion.div>
                                        </Link>
                                    )
                                })}
                            </div>



                            <div className="group">
                                <div className="list list2">
                                    <p>Manga Stats</p>
                                </div>

                                {mangaList.map((item, index) => {
                                    const isActive = item.path === pathname;
                                    const isHovered = hoveredIndex === index;

                                    const transitionVariants = {
                                        active: { backgroundColor: '#111e22', color: "rgb(149, 164, 185)" },
                                        inactive: { backgroundColor: 'rgba(17, 30, 34, 0)', color: "rgb(124, 137, 154)" },
                                        hovered: { backgroundColor: "#111e22" }
                                    };
                                    return (
                                        <Link href={item.path} key={item.path}>
                                            <motion.div
                                                className={`${pathname === "/Profile/Animelist" ? "listOption" : "listOption listOption2"} ${isActive ? 'optionActive2' : ''}`}
                                                initial="inactive"
                                                animate={isHovered ? 'hovered' : isActive ? 'active' : 'inactive'}
                                                variants={transitionVariants}
                                                onMouseOver={() => setHoveredIndex(index)}
                                                onMouseOut={() => setHoveredIndex(null)}
                                                transition={{ duration: 0, ease: 'easeInOut' }}
                                            >
                                                {item.name}
                                            </motion.div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                    </div>

                    <div className="StatsMainContainer">
                        <div className="StatsMain">
                            <div className="statsMainGora">
                                {(pathname.includes("/Profile/Stats/Anime/") ? animeOption : mangaOption).map((item) => {

                                    return (
                                        <div key={item.name} className="statsMainTotal">
                                            <div className="circle">
                                                {item.icon()}

                                            </div>
                                            <div className="statsMainInfo">
                                                <span className="wynikStats">{item.value}</span>
                                                <p className="opisStats">{item.name}</p>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>

                            <div className="statsMainScore">
                                <div className="headerScore">
                                    <h3>Score</h3>
                                    <div className="scoreSwitch">
                                        <div className={`optionScore ${isON ? "scoreActive" : ""}`} >
                                            <span onClick={() => isFunction()}>
                                                {(pathname.includes("/Profile/Stats/Anime/") ? animeSwitch[0] : mangaSwitch[0]).name}
                                            </span>
                                        </div>

                                        <div className={`optionScore ${isON2 ? "scoreActive" : ""}`}>
                                            <span onClick={() => isFunction2()}>
                                                {(pathname.includes("/Profile/Stats/Anime/") ? animeSwitch[1] : mangaSwitch[1]).name}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="statsBarContainer" onMouseLeave={handleToolTipClose}>
                                <div className="statsBarBody">


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top-start"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === 'tooltip1'}
                                            style={{
                                                zIndex: "1",
                                            }}

                                        >

                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('tooltip1')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>

                                    </div>



                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === 'tooltip2'}
                                            style={{
                                                zIndex: "1"
                                            }}
                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('tooltip2')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            style={{
                                                zIndex: "1"
                                            }}
                                            isOpen={isOpen === 'tooltip3'}
                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('tooltip3')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === 'tooltip4'}
                                            style={{
                                                zIndex: "1"
                                            }}
                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('tooltip4')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === 'tooltip5'}
                                            style={{
                                                zIndex: "1"
                                            }}
                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('tooltip5')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === 'tooltip6'}
                                            style={{
                                                zIndex: "1"
                                            }}
                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('tooltip6')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top-end"
                                            className="tooltip "
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === 'tooltip7'}
                                            style={{
                                                zIndex: "1"
                                            }}

                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('tooltip7')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>



                                </div>

                                <div className="statsBarBottom">
                                    <div className="barLabel">1</div>
                                    <div className="barLabel">2</div>
                                    <div className="barLabel">3</div>
                                    <div className="barLabel">4</div>
                                    <div className="barLabel">5</div>
                                    <div className="barLabel">6</div>
                                    <div className="barLabel">7</div>
                                </div>

                            </div>

                            <div className="statsMainScore">
                                <div className="headerScore">
                                    <h3 >{(pathname.includes("/Profile/Stats/Anime/") ? statsH3Anime[0] : statsH3Manga[0]).name}</h3>
                                    <div className="scoreSwitch">
                                        <div className={`optionScore ${isSwitch ? "scoreActive" : ""}`} >
                                            <span onClick={() => isFunctionSwitch()}>
                                                {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[0] : statsSwitchManga[0]).name}
                                            </span>
                                        </div>

                                        <div className={`optionScore ${isSwitch2 ? "scoreActive" : ""}`}>
                                            <span onClick={() => isFunctionSwitch2()}>
                                                {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[1] : statsSwitchManga[1]).name}
                                            </span>
                                        </div>

                                        <div className={`optionScore ${isSwitch3 ? "scoreActive" : ""}`}>
                                            <span onClick={() => isFunctionSwitch3()}>
                                                {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[2] : statsSwitchManga[2]).name}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>



                            <div className="statsBarContainer" onMouseLeave={handleToolTipClose}>



                                <div className="statsBarBody">


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top-start"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === '2tooltip1'}
                                            style={{
                                                zIndex: "1"
                                            }}


                                        >

                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('2tooltip1')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>

                                    </div>



                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === '2tooltip2'}
                                            style={{
                                                zIndex: "1"
                                            }}
                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('2tooltip2')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === '2tooltip3'}
                                            style={{
                                                zIndex: "1"
                                            }}
                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('2tooltip3')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === '2tooltip4'}
                                            style={{
                                                zIndex: "1"
                                            }}
                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('2tooltip4')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            style={{
                                                zIndex: "1"
                                            }}
                                            isOpen={isOpen === '2tooltip5'}
                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('2tooltip5')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === '2tooltip6'}
                                            style={{
                                                zIndex: "1"
                                            }}
                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('2tooltip6')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>


                                    <div className="bar-wrap">
                                        <Tooltip
                                            showArrow={true}
                                            placement="top-end"
                                            className="tooltip"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content}
                                            offset={30}
                                            isOpen={isOpen === '2tooltip7'}
                                            style={{
                                                zIndex: "1"
                                            }}

                                        >
                                            <div className="barStats" color="secondary"
                                                onMouseEnter={() => handleToolTipOpen('2tooltip7')}

                                            >
                                                <div className="barValue" color="secondary">6</div>
                                            </div>
                                        </Tooltip>
                                    </div>



                                </div>

                                <div className="statsBarBottom" >
                                    <div className="barLabel">1</div>
                                    <div className="barLabel">2</div>
                                    <div className="barLabel">3</div>
                                    <div className="barLabel">4</div>
                                    <div className="barLabel">5</div>
                                    <div className="barLabel">6</div>
                                    <div className="barLabel">7</div>
                                </div>




                            </div>

                            <div className="pie-charts">
                                <div className="pie-chart">
                                    <div className="pieTitle">Format Distribution</div>
                                    <div className="pieWrap">

                                        <div className="pieImgContainer">
                                            <svg width="80" height="80" >
                                                <g transform="translate(40, 40)">
                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '3tooltip1'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >



                                                        <path
                                                            fill="rgb(20, 184, 166)"
                                                            d="M2.4492935982947065e-15,-40A40,40,0,1,1,-24.803530768255673,-31.381282023336684L0,0Z"
                                                            onMouseEnter={() => handleToolTipOpen('3tooltip1')}
                                                        />



                                                    </Tooltip>

                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '3tooltip2'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('3tooltip2')} fill="#2C3E50" d="M-24.803530768255673,-31.381282023336684A40,40,0,0,1,-15.026015289131616,-37.07045811061394L0,0Z"></path>



                                                    </Tooltip>

                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '3tooltip3'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('3tooltip3')} fill="#ef4444" d="M-15.026015289131616,-37.07045811061394A40,40,0,0,1,-4.046732879497276,-39.79477293567581L0,0Z"></path>



                                                    </Tooltip>

                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '3tooltip4'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('3tooltip4')} fill="#f97316" d="M-4.046732879497276,-39.79477293567581A40,40,0,0,1,-1.6210231406724962,-39.967140052515695L0,0Z"></path>



                                                    </Tooltip>


                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '3tooltip5'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('3tooltip5')} fill="#6366f1" d="M-1.6210231406724962,-39.967140052515695A40,40,0,0,1,2.8179255993120888e-14,-40L0,0Z"></path>



                                                    </Tooltip>







                                                </g>
                                            </svg>
                                        </div>

                                        <div className="pieLabels">
                                            <div className="pieLabelWrap" style={{
                                                backgroundColor: "rgb(20, 184, 166)"
                                            }}>
                                                <div className="pieLabel">TV</div>
                                                <div className="piePercent">89%</div>
                                            </div>

                                            <div className="pieLabelWrap" style={{
                                                backgroundColor: "#2C3E50"
                                            }}>
                                                <div className="pieLabel">ONA</div>
                                                <div className="piePercent">89%</div>
                                            </div>

                                            <div className="pieLabelWrap" style={{
                                                backgroundColor: "#ef4444"
                                            }}>
                                                <div className="pieLabel">Movie</div>
                                                <div className="piePercent">89%</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="pie-chart">
                                    <div className="pieTitle">Status Distribution</div>
                                    <div className="pieWrap">

                                        <div className="pieImgContainer">
                                            <svg width="80" height="80" >
                                                <g transform="translate(40, 40)">
                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '4tooltip1'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >



                                                        <path
                                                            fill="rgb(20, 184, 166)"
                                                            d="M2.4492935982947065e-15,-40A40,40,0,1,1,-24.803530768255673,-31.381282023336684L0,0Z"
                                                            onMouseEnter={() => handleToolTipOpen('4tooltip1')}
                                                        />



                                                    </Tooltip>

                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '4tooltip2'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('4tooltip2')} fill="#2C3E50" d="M-24.803530768255673,-31.381282023336684A40,40,0,0,1,-15.026015289131616,-37.07045811061394L0,0Z"></path>



                                                    </Tooltip>

                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '4tooltip3'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('4tooltip3')} fill="#ef4444" d="M-15.026015289131616,-37.07045811061394A40,40,0,0,1,-4.046732879497276,-39.79477293567581L0,0Z"></path>



                                                    </Tooltip>

                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '4tooltip4'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('4tooltip4')} fill="#f97316" d="M-4.046732879497276,-39.79477293567581A40,40,0,0,1,-1.6210231406724962,-39.967140052515695L0,0Z"></path>



                                                    </Tooltip>


                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '4tooltip5'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('4tooltip5')} fill="#6366f1" d="M-1.6210231406724962,-39.967140052515695A40,40,0,0,1,2.8179255993120888e-14,-40L0,0Z"></path>



                                                    </Tooltip>







                                                </g>
                                            </svg>
                                        </div>

                                        <div className="pieLabels">
                                            <div className="pieLabelWrap" style={{
                                                backgroundColor: "rgb(20, 184, 166)"
                                            }}>
                                                <div className="pieLabel">Completed</div>
                                                <div className="piePercent">89%</div>
                                            </div>

                                            <div className="pieLabelWrap" style={{
                                                backgroundColor: "#2C3E50"
                                            }}>
                                                <div className="pieLabel">Dropped</div>
                                                <div className="piePercent">89%</div>
                                            </div>

                                            <div className="pieLabelWrap" style={{
                                                backgroundColor: "#ef4444"
                                            }}>
                                                <div className="pieLabel">Watching</div>
                                                <div className="piePercent">89%</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="pie-chart">
                                    <div className="pieTitle">Country Distribution</div>
                                    <div className="pieWrap">

                                        <div className="pieImgContainer">
                                            <svg width="80" height="80" >
                                                <g transform="translate(40, 40)">
                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '5tooltip1'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >



                                                        <path
                                                            fill="rgb(20, 184, 166)"
                                                            d="M2.4492935982947065e-15,-40A40,40,0,1,1,-24.803530768255673,-31.381282023336684L0,0Z"
                                                            onMouseEnter={() => handleToolTipOpen('5tooltip1')}
                                                        />



                                                    </Tooltip>

                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '5tooltip2'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('5tooltip2')} fill="#2C3E50" d="M-24.803530768255673,-31.381282023336684A40,40,0,0,1,-15.026015289131616,-37.07045811061394L0,0Z"></path>



                                                    </Tooltip>

                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '5tooltip3'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('5tooltip3')} fill="#ef4444" d="M-15.026015289131616,-37.07045811061394A40,40,0,0,1,-4.046732879497276,-39.79477293567581L0,0Z"></path>



                                                    </Tooltip>

                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '5tooltip4'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('5tooltip4')} fill="#f97316" d="M-4.046732879497276,-39.79477293567581A40,40,0,0,1,-1.6210231406724962,-39.967140052515695L0,0Z"></path>



                                                    </Tooltip>


                                                    <Tooltip
                                                        showArrow={true}
                                                        placement="top"
                                                        className="tooltip"
                                                        closeDelay={150}
                                                        delay={50}
                                                        color="foreground"
                                                        content={content}
                                                        offset={30}
                                                        isOpen={isOpen === '5tooltip5'}
                                                        style={{
                                                            zIndex: "1"
                                                        }}

                                                    >




                                                        <path onMouseEnter={() => handleToolTipOpen('5tooltip5')} fill="#6366f1" d="M-1.6210231406724962,-39.967140052515695A40,40,0,0,1,2.8179255993120888e-14,-40L0,0Z"></path>



                                                    </Tooltip>







                                                </g>
                                            </svg>
                                        </div>

                                        <div className="pieLabels">
                                            <div className="pieLabelWrap" style={{
                                                backgroundColor: "rgb(20, 184, 166)"
                                            }}>
                                                <div className="pieLabel">Japan</div>
                                                <div className="piePercent">89%</div>
                                            </div>

                                            <div className="pieLabelWrap" style={{
                                                backgroundColor: "#2C3E50"
                                            }}>
                                                <div className="pieLabel">China</div>
                                                <div className="piePercent">89%</div>
                                            </div>

                                            <div className="pieLabelWrap" style={{
                                                backgroundColor: "#ef4444"
                                            }}>
                                                <div className="pieLabel">South Korea</div>
                                                <div className="piePercent">89%</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="statsMainScore">
                                <div className="headerScore">
                                    <h3 >Release Year</h3>
                                    <div className="scoreSwitch">
                                        <div className={`optionScore ${isSwitch4 === "siemano" ? "scoreActive" : ""}`} >
                                            <span onClick={() => isFunctionSwitch4("siemano")}>
                                                {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[0] : statsSwitchManga[0]).name}
                                            </span>
                                        </div>

                                        <div className={`optionScore ${isSwitch4 === "siemano1" ? "scoreActive" : ""}`}>
                                            <span onClick={() => isFunctionSwitch4("siemano1")}>
                                                {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[1] : statsSwitchManga[1]).name}
                                            </span>
                                        </div>

                                        <div className={`optionScore ${isSwitch4 === "siemano3" ? "scoreActive" : ""}`}>
                                            <span onClick={() => isFunctionSwitch4("siemano3")}>
                                                {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[2] : statsSwitchManga[2]).name}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>


                            <div className="statsMainScore">
                                <div className="headerScore">
                                    <h3 >{(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchYear[0] : statsSwitchYear[1]).name}</h3>
                                    <div className="scoreSwitch">
                                        <div className={`optionScore ${isSwitch5 === "cosik" ? "scoreActive" : ""}`} >
                                            <span onClick={() => isFunctionSwitch5("cosik")}>
                                                {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[0] : statsSwitchManga[0]).name}
                                            </span>
                                        </div>

                                        <div className={`optionScore ${isSwitch5 === "cosik1" ? "scoreActive" : ""}`}>
                                            <span onClick={() => isFunctionSwitch5("cosik1")}>
                                                {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[1] : statsSwitchManga[1]).name}
                                            </span>
                                        </div>

                                        <div className={`optionScore ${isSwitch5 === "cosik2" ? "scoreActive" : ""}`}>
                                            <span onClick={() => isFunctionSwitch5("cosik2")}>
                                                {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[2] : statsSwitchManga[2]).name}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>

                </div >
            </div >
        </>
    );
}
