"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion"

const navItems = [
    {
        path: "/",
        name: "Home",
        icon: (isActive) => (
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                preserveAspectRatio="xMidYMid meet" className="svgNav">

                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                    fill={isActive ? "rgb(20, 184, 166)" : "currentColor"} stroke="none">
                    <path d="M2443 5105 c-130 -36 -94 -3 -1246 -1153 -598 -598 -1101 -1107
-1117 -1131 -124 -185 -99 -433 59 -592 92 -91 209 -139 343 -139 l68 0 0
-800 c0 -541 4 -816 11 -852 38 -182 185 -347 367 -410 66 -23 71 -23 554 -23
476 0 487 0 514 21 15 11 37 33 48 48 21 27 21 40 26 695 l5 668 30 49 c38 61
115 110 189 119 28 4 168 5 311 3 l260 -3 53 -29 c50 -28 82 -61 113 -116 11
-21 15 -144 19 -692 5 -654 5 -667 26 -694 11 -15 33 -37 48 -48 27 -21 38
-21 514 -21 483 0 488 0 554 23 182 63 329 228 367 410 7 36 11 311 11 852 l0
800 68 0 c240 0 434 163 474 398 15 92 0 190 -43 282 -29 60 -116 150 -1118
1153 -597 598 -1107 1101 -1133 1118 -26 17 -71 40 -100 51 -70 27 -204 33
-275 13z"/>
                </g>
            </svg>

        )
    },
    {
        path: "/Profile/Animelist",
        name: "Anime",
        icon: (isActive) => (
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                preserveAspectRatio="xMidYMid meet" className="svgNav">

                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                    fill={isActive ? "rgb(20, 184, 166)" : "currentColor"} stroke="none">
                    <path d="M355 4690 c-77 -13 -110 -25 -170 -66 -65 -43 -127 -119 -158 -196
l-22 -53 -3 -1505 c-2 -1097 0 -1521 8 -1565 30 -152 142 -275 292 -320 44
-13 141 -15 659 -15 l608 0 3 -224 c3 -247 4 -250 72 -300 27 -21 34 -21 916
-21 882 0 889 0 916 21 68 50 69 53 72 300 l3 224 608 0 c518 0 615 2 659 15
150 45 262 168 292 320 8 44 10 468 8 1565 l-3 1505 -22 53 c-46 114 -130 195
-252 244 l-56 23 -2190 1 c-1204 1 -2212 -2 -2240 -6z m4205 -1855 l0 -1295
-2000 0 -2000 0 0 1295 0 1295 2000 0 2000 0 0 -1295z"/>
                    <path d="M2034 3580 c-56 -22 -54 8 -54 -783 l0 -729 29 -29 c21 -21 39 -29
63 -29 27 0 171 79 644 351 335 193 619 362 632 375 27 31 30 92 5 123 -28 33
-1243 731 -1273 730 -14 0 -35 -4 -46 -9z"/>
                </g>
            </svg>
        )
    },
    {
        path: "/Profile/Mangalist",
        name: "Manga",
        icon: (isActive) => (
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                preserveAspectRatio="xMidYMid meet" className="svgNav">

                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                    fill={isActive ? "rgb(20, 184, 166)" : "currentColor"} stroke="currentColor">
                    <path d="M695 5106 c-119 -29 -233 -125 -277 -234 l-23 -57 0 -2255 0 -2255
23 -57 c67 -165 262 -272 438 -239 88 16 149 48 225 118 34 32 380 363 767
735 388 373 708 678 712 678 4 0 324 -305 712 -677 850 -818 821 -791 883
-819 207 -95 465 1 547 204 l23 57 0 2255 0 2255 -23 57 c-29 71 -103 155
-169 191 -112 60 3 57 -1978 56 -1384 -1 -1822 -4 -1860 -13z m3595 -2518 l0
-2102 -82 80 c-166 160 -1535 1471 -1590 1523 l-58 54 -57 -54 c-56 -52 -1425
-1363 -1591 -1523 l-82 -80 0 2102 0 2102 1730 0 1730 0 0 -2102z"/>
                </g>
            </svg>
        )
    },
    {
        path: "/Profile/Overview",
        name: "Profile",
        icon: (isActive) => (
            <svg width="800px" height="800px" viewBox="0 0 20 20" version="1.1" className="svgNav" >
                <title>profile_round [#1342]</title>
                <desc>Created with Sketch.</desc>
                <defs>

                </defs>
                <g id="Page-1" stroke="none" strokeWidth="1" fill="currentColor" fillRule="evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill={isActive ? "rgb(20, 184, 166)" : "currentColor"}>
                        <g id="icons" transform="translate(56.000000, 160.000000)">
                            <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#1342]">

                            </path>
                        </g>
                    </g>
                </g>
            </svg >
        ),
    },
    {
        path: "/Browse",
        name: "Explore",
        icon: (isActive) => (
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                preserveAspectRatio="xMidYMid meet" className="svgNav">

                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                    fill={isActive ? "rgb(20, 184, 166)" : "currentColor"} stroke="none">
                    <path d="M2330 5110 c-892 -87 -1667 -619 -2060 -1415 -126 -254 -196 -474
-242 -755 -31 -195 -31 -565 0 -760 46 -281 116 -501 242 -755 250 -505 650
-905 1155 -1155 254 -126 474 -196 755 -242 195 -31 565 -31 760 0 281 46 501
116 755 242 505 250 905 650 1155 1155 93 187 136 302 185 486 63 240 78 371
78 649 0 278 -15 409 -78 649 -49 184 -92 299 -185 486 -250 505 -650 905
-1155 1155 -254 126 -479 197 -750 240 -147 23 -475 34 -615 20z m405 -510
c193 -18 353 -54 525 -118 284 -106 534 -266 745 -477 566 -566 752 -1405 477
-2145 -106 -284 -266 -534 -477 -745 -566 -566 -1405 -752 -2145 -477 -499
186 -897 544 -1133 1017 -286 576 -286 1234 0 1810 376 756 1183 1212 2008
1135z"/>
                    <path d="M2950 3459 c-487 -209 -890 -386 -897 -392 -9 -9 -722 -1655 -764
-1764 -7 -20 -6 -21 14 -14 109 42 1755 755 1764 764 13 14 778 1788 770 1787
-1 0 -400 -172 -887 -381z m-270 -677 c179 -89 178 -354 -3 -446 -153 -78
-330 6 -366 174 -28 131 53 260 187 296 60 17 113 10 182 -24z"/>
                </g>
            </svg>
        )
    },
];





export default function Nav({ }) {
    let pathname = usePathname() || "/";

    if (pathname.includes("/Profile/") && !pathname.includes("/Profile/Animelist") && !pathname.includes("/Profile/Mangalist")) {
        pathname = "/Profile/Overview";
    }

    if (pathname.includes("/Browse/")) {
        pathname = "/Browse"
    }

    if (pathname.includes("/anime/")) {
        pathname = "/Profile/Animelist"
    }

    if (pathname.includes("/manga/")) {
        pathname = "/Profile/Mangalist"
    }



    return (


        <>
            <section className="sNav navPc">
                <div className="navBody">

                    <ul>
                        <li>
                            {navItems.map((item) => {
                                const isActive = item.path === pathname;

                                return (
                                    <Link
                                        key={item.path}
                                        className={`aLink`}
                                        data-active={isActive}
                                        href={item.path}

                                        style={{
                                            color: `${isActive ? "rgb(20, 184, 166)" : ""}`,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}

                                    >

                                        {item.icon && item.icon(isActive)}
                                        {item.name}
                                        {isActive && (
                                            <motion.div
                                                className="animacja"
                                                layoutId="navbar"
                                                aria-hidden="true"
                                                style={{
                                                    width: "100%",

                                                    originY: "0px",
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    bounce: 0.25,
                                                    stiffness: 130,
                                                    damping: 9,
                                                    duration: 0.3,
                                                }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </li>
                    </ul>
                </div>
            </section >

        </>
    );
}
