"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {useBrowseContext} from "@/src/app/components/BrowseProvider";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import Link from "next/link";
import { Tooltip } from "@heroui/react";
import {useMediaQuery} from "@mantine/hooks";



export default function Header({ handleChangeFocus }) {

    const {   searchAnime, data, error, loading,
        PopularData, PopularLoading, PopularError,
        seasonalData, seasonalLoading, seasonalError,
        allTimeData, allTimeLoading, allTimeError,
        dataGenres, errorGenres, loadingGenres,
        nextData, nextLoading, nextError,
        fetchMore, setVisible, setSelectedKeys,
        selectedKeys, nextYear, season,
        seasonYear, seasonNext, seasonNextYear, clearTag, isVisible,
        sortArray, type, format, statusSearch, countryOfOrigin, genres, year, season2,} = useBrowseContext();

    const router = useRouter();

    const [focus, setFocus] = useState(false);
    const [query, setQuery] = useState("");


    const [showResults, setResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isAdult = false;
    const isClass = useMediaQuery("(min-width: 1024px)");
    const searchParams = useSearchParams()
    const search = searchParams.get("search")
    const type2 = searchParams.get("type")



    const handleFocus = (isFocused) => {
        setFocus(isFocused)
        handleChangeFocus(isFocused)
    }










    function cosik() {
        setQuery('')
        setResults(false)
        setToggle(false)
        handleFocus(false)
    }

    const variants = {
        focused: { opacity: 1, scale: 1, left: "20px" },
        unfocused: { opacity: 0.7, scale: 1, right: "10px" },
        arrowActive: { opacity: 1 },
        arrowHidden: { opacity: 0 },
        showSection: { opacity: 1, display: "block" },  // Corrected here
        hidSection: { opacity: 0, display: "none" },
        imgAnimate: { scale: 1 },
        imgNotAnimate: { scale: 0.95 },
        show: { opacity: 1, display: "", top: "75px" },  // Corrected here
        hid: { opacity: 0, display: "none", top: "65px" },
    };







    const pathname = usePathname() || "/";




    const years = Array.from({ length: nextYear - 1960 + 1 }, (_, i) => nextYear - i);


    const handleScroll = () => {
        if (pathname.includes("/Browse/")) {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 200
            ) {
                loadMore();
            }
        }
    };


    const loadMore = () => {
        if (!seasonalLoading && seasonalData?.Page?.pageInfo?.hasNextPage) {
            setIsLoading(true)

            fetchMore({
                variables: {
                    page: seasonalData.Page.pageInfo.currentPage + 1
                },

                updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return previousResult;

                    const mergedMedia = [
                        ...previousResult.Page.media,
                        ...fetchMoreResult.Page.media.filter((newItem) =>
                            !previousResult.Page.media.some((oldItem) => oldItem.id === newItem.id))
                    ]

                    return {
                        ...fetchMoreResult,
                        Page: {
                            ...fetchMoreResult.Page,
                            media: mergedMedia
                        }
                    }
                }
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }


    // Dodanie event listenera do scrollowania
    useEffect(() => {
        if (pathname.includes("/Browse/")) {
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }

    }, [seasonalData, seasonalLoading]);





    const formatTab = [
        {
            name: "TV",
            key: "TV"
        },
        {
            name: "Movie",
            key: "Movie"
        },
        {
            name: "TV Short",
            key: "TV Short"
        },
        {
            name: "Special",
            key: "Special"
        },
        {
            name: "OVA",
            key: "OVA"
        },
        {
            name: "ONA",
            key: "ONA"
        },
        {
            name: "Music",
            key: "Music"
        },
    ]

    const sortTab = [
        {
            name: "Popularity"
        },
        {
            name: "Average Score"
        },
        {
            name: "Trending"
        },
        {
            name: "Release Date"
        }
    ]

    const mangaFormat = [
        {
            name: "Manga",
            key: "Manga"
        },
        {
            name: "Novel",
            key: "Novel"
        },
        {
            name: "One Shot",
            key: "One Shot"
        }
    ]

    const statusTab = [
        {
            name: "Finished",
            key: "Finished"
        },
        {
            name: "Releasing",
            key: "Releasing"
        },
        {
            name: "Not Yet Released",
            key: "Not Yet Released"
        },
        {
            name: "Cancelled",
            key: "Cancelled"
        },
        {
            name: "Hiatus",
            key: "Hiatus"
        }
    ]

    const typeSearchTab = [
        {
            name: "Anime",
            key: "Anime"
        },
        {
            name: "Manga",
            key: "Manga"
        }
    ]

    const CountryOfOriginTab = [
        {
            name: "Japan",
            key: "Japan",
        },
        {
            name: "South Korea",
            key: "South Korea",
        },
        {
            name: "China",
            key: "China",
        },
        {
            name: "Taiwan",
            key: "Taiwan",
        },
    ]

    const SeasonTab = [
        {
            name: "Winter",
            key: "Winter"
        },
        {
            name: "Spring",
            key: "Spring"
        },
        {
            name: "Summer",
            key: "Summer"
        },
        {
            name: "Fall",
            key: "Fall"
        },
    ]





    const formatValue = useMemo(() => {
        if (selectedKeys.format.has("") && selectedKeys.format.size === 1) {
            return "Any"
        }


        const format = Array.from(selectedKeys.format).filter(format => format !== "").map((format) => format.replaceAll("_ ", " "));


        if (format.length === 0) {
            return `Any`
        }

        if (format.length >= 2) {
            return `${format[0]} + ${format.length - 1}`
        }

        return format.join(", ");
    }, [selectedKeys.format])



    const typeSearchValue = useMemo(() => {
        const type = Array.from(selectedKeys.typeSearch)
            .filter(typeSearch => typeSearch !== "")
            .map(typeSearch => typeSearch.replaceAll("_ ", " "));



        return type.join(", ");
    }, [selectedKeys.typeSearch]);




    const countryValue = useMemo(() => {
        const country = Array.from(selectedKeys.country).filter(country => country !== "").map((country) => country.replaceAll("_ ", " "));


        if (country.length === 0) {
            return "Any"
        }

        return country.join(", ")
    }, [selectedKeys.country])

    const statusValue = useMemo(() => {
        const status = Array.from(selectedKeys.status).filter(status => status !== "").map((status) => status.replaceAll("_ ", " "));


        if (status.length === 0) {
            return "Any"
        }

        return status.join(", ")
    }, [selectedKeys.status])



    const seasonValue = useMemo(() => {
        // Sprawdzanie, czy pathname to "/Browse/upcomingAll"


        // Filtruj i mapuj sezony
        const seasons = Array.from(selectedKeys.season)
            .filter(season => season !== "")
            .map(season => season.replaceAll("_", " "));



        if (seasons.length === 0) {
            return `Any`;
        }

        if (seasons.length >= 2) {
            return `${seasons[0]} + ${seasons.length - 1}`;
        }

        return seasons.join(", ");
    }, [selectedKeys.season, pathname]);


    const yearValue = useMemo(() => {


        const year = Array.from(selectedKeys.year).filter(year => year !== "").map((year) => year.replaceAll("_", " "));

        if (year.length === 0) {
            return `Any`
        }

        if (year.length >= 2) {
            return `${year[0]} + ${year.length - 1}`
        }

        return year.join(", ")

    }, [selectedKeys.year]);


    const genresValue = useMemo(() => {
        if (selectedKeys.genres.has("") && selectedKeys.genres.size === 1) {
            return "Any";
        }
        const genres = Array.from(selectedKeys.genres).filter(genres => genres !== "").map((genres) => genres.replaceAll("_", " "));

        if (genres.length === 0) {
            return `Any`
        }

        if (genres.length >= 2) {
            return `${genres[0]} + ${genres.length - 1}`
        }

        return genres.join(", ")
    }, [selectedKeys.genres]);

    const tagsValue = () => {
        const format = Array.from(selectedKeys.format).filter((format) => format !== "").map((format) => ({
            key: "format",
            value: format.replaceAll("_", " ")
        }))


        const genres = Array.from(selectedKeys.genres).filter((genres) => genres !== "").map((genres) => ({
            key: "genres",
            value: genres.replaceAll("_ ", " ")
        }))


        const country = Array.from(selectedKeys.country).filter((country) => country !== "").map((country) => ({
            key: "country",
            value: country.replaceAll("_", " ")
        }))

        const status = Array.from(selectedKeys.status).filter((status) => status !== "").map((status) => ({
            key: "status",
            value: status.replaceAll("_ ", " ")
        }))


        const year = Array.from(selectedKeys.year).filter((year) => year !== "").map((year) => ({
            key: "year",
            value: year.replaceAll("_ ", " ")
        }))

        const Season = Array.from(selectedKeys.season).filter((season) => season !== "").map((season) => ({
            key: "season",
            value: season.replaceAll("_ ", " ")
        }))



        const allTags = [...format, ...genres, ...year, ...Season, ...country, ...status]

        return allTags.map((item, index) => (
            <button
                key={index}
                style={{
                    display: focus || pathname.includes("/Browse") ? "" : "none"
                }}
                onClick={() => handleRemoveTag(item.key, item.value)}
                className="filterButton">
                {item.value}
                <svg data-v-cd1dc2b6="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="iconFilterSvg"><path data-v-cd1dc2b6="" className="iconFilterSvg" fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
            </button>
        ))
    }

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };



    const handleSearch = debounce((query) => {
        if (query.trim() !== "") {
            searchAnime({
                variables: {
                    search: query,
                    isAdult,
                    season: season2 || undefined,
                    format: format || undefined,
                    seasonYear: year || undefined,
                    genreIn: genres.length > 0 ? genres : undefined,
                    type: type,
                    countryOfOrigin: countryOfOrigin || undefined,
                    status: statusSearch || undefined,
                    sort: sortArray
                },
            });
            setResults(true);

        } else {
            setResults(false);
        }



    }, 300);

    const handleChange = (e) => {
        setQuery(e.target.value)
        handleSearch(e.target.value)
    }


    /*
        useEffect(() => {
            window
                .matchMedia("(min-width: 1024px)")
                .addEventListener('change', () => handleFocus(false));
        }, []);
        */

    const setQueryClear = () => {
        setQuery('')
        handleSearch('')
    }

    const updateVisibility = (selectedKeys) => {

        const { typeSearch, sort, ...restOfSelectedKeys } = selectedKeys;


        console.log(typeSearch);
        console.log(sort);

        const hasVisibleTags = Object.values(restOfSelectedKeys).some(
            (set) =>
                Array.from(set)
                    .filter((item) => item !== "")
                    .length > 0
        );


        setVisible(hasVisibleTags);
    };





    const handleRemoveAllTags = () => {

        setSelectedKeys((prev) => {
            const typeSearch = prev.typeSearch
            const updatedKeys = Object.keys(prev).reduce((acc, key) => {
                if (key !== 'typeSearch') {
                    acc[key] = new Set();
                } else {
                    acc[key] = typeSearch;
                }
                return acc;
            }, {});



            updateVisibility(updatedKeys);


            return updatedKeys;
        })


        const { typeSearch, sort, ...restOfSelectedKeys } = selectedKeys;

        console.log(typeSearch);
        console.log(sort);
        const hasVisibleTags = Object.values(restOfSelectedKeys).reduce((acc, set) => acc + Array.from(set).filter((item) => item !== "").length, 0)

        if (hasVisibleTags >= 2 && pathname.includes("/Browse/")) {
            router.push('/Browse');
        }
    }






    useEffect(() => {
        handleSearch(query);
    }, [selectedKeys]);

    useEffect(() => {
        if (pathname === "/Browse") {
            handleRemoveAllTags();
        }

    }, [selectedKeys.typeSearch]);

    const seasonTab = Array.from(season)
        .map((char, index) => index === 0 ? char : char.toLowerCase())
        .join("");

    const seasonNextTab = Array.from(seasonNext)
        .map((char, index) => index === 0 ? char : char.toLowerCase())
        .join("");






    useEffect(() => {

        if (search || type2) {
            setSelectedKeys(prevState => {
                const updatedState = {
                    ...prevState,
                    typeSearch: new Set([type2]),

                };
                setQuery(search)
                updateVisibility(updatedState)
                return updatedState
            })

            handleFocus(true)
            handleToggleChange("toggle", !isToggle.toggle)
        }
    }, [search, type2]);


    useEffect(() => {
        if (pathname === "/Browse/upcomingAll") {
            setSelectedKeys(prevState => {
                const updatedState = {
                    ...prevState,
                    year: new Set([`${seasonNextYear}`]),
                    season: new Set([seasonNextTab]),
                    sort: new Set(["Popularity"])
                };
                updateVisibility(updatedState);
                return updatedState;
            });

            handleFocus(true)
            handleToggleChange("toggle", !isToggle.toggle)

        }

        if (pathname === "/Browse/popularAll") {
            setSelectedKeys(prevState => {
                const updatedState = {
                    ...prevState,
                    sort: new Set(["Trending"])
                };
                updateVisibility(updatedState)
                return updatedState
            })

            handleFocus(true)
            handleToggleChange("toggle", !isToggle.toggle)

        }




        if (pathname === "/Browse/seasonalAll") {
            setSelectedKeys(prevState => {
                const updatedState = {
                    ...prevState,
                    season: new Set([seasonTab]),
                    year: new Set([`${seasonYear}`]),
                    sort: new Set(["Popularity"])
                };
                updateVisibility(updatedState)
                return updatedState

            })

            handleFocus(true)
            handleToggleChange("toggle", !isToggle.toggle)


        }

        if (pathname === "/Browse/seasonalManga") {
            setSelectedKeys(prevState => {
                const updatedState = {
                    ...prevState,
                    typeSearch: new Set(["Manga"]),
                    sort: new Set(["Average Score"]),
                    country: new Set(["South Korea"])
                };
                updateVisibility(updatedState)
                return updatedState
            })

            handleFocus(true);
            handleToggleChange("toggle", !isToggle.toggle)
        }







        if (pathname === "/Browse/popularManga") {
            setSelectedKeys(prevState => {
                const updatedState = {
                    ...prevState,
                    typeSearch: new Set(["Manga"]),
                    sort: new Set(["Trending"])
                };
                updateVisibility(updatedState);
                return updatedState;
            })

            handleFocus(true)
            handleToggleChange("toggle", !isToggle.toggle)
        }

        if (pathname === "/Browse/emissionAll") {
            setSelectedKeys(prevState => {
                const updatedState = {
                    ...prevState,
                    typeSearch: new Set(["Anime"]),
                    sort: new Set(["Trending"]),
                    status: new Set(["Releasing"])
                };
                updateVisibility(updatedState);
                return updatedState;
            })

            handleFocus(true)
            handleToggleChange("toggle", !isToggle.toggle)
        }










        if (pathname === "/Browse/alltimeManga") {
            setSelectedKeys(prevState => {
                const updatedState = {
                    ...prevState,
                    typeSearch: new Set(["Manga"]),
                    sort: new Set(["Popularity"])
                };
                updateVisibility(updatedState);
                return updatedState;
            })

            handleFocus(true)
            handleToggleChange("toggle", !isToggle.toggle)
        }

















        if (pathname === "/Browse/alltimeAll") {
            handleFocus(true)
            handleToggleChange("toggle", !isToggle.toggle)
        }





    }, [pathname]);






    const handleSelectionChange = (key, newSelectedKey) => {
        handleSearch(query)
        setSelectedKeys((prev) => {
            const updatedKeys = {
                ...prev,
                [key]: new Set([...newSelectedKey].filter((item) => item !== "")),
            };
            updateVisibility(updatedKeys);




            return updatedKeys;
        });




    };


    const onClickChange = () => {
        if (hasVisibleTags === 0 && pathname.includes("/Browse/")) {
            router.push('/Browse');
        }
    }



    const { typeSearch, sort, ...restOfSelectedKeys } = selectedKeys;
    console.log(typeSearch);
    console.log(sort);

    const hasVisibleTags = Object.values(restOfSelectedKeys).reduce((acc, set) => acc + Array.from(set).filter((item) => item !== "").length, 0)
    const handleRemoveTag = (key, value) => {
        setSelectedKeys((prev) => {
            const updatedSet = new Set([...prev[key]].filter((item) => item !== value && item !== ""));
            const updatedKeys = {
                ...prev,
                [key]: updatedSet,
            };
            updateVisibility(updatedKeys);

            return updatedKeys;
        });


        if (hasVisibleTags === 1 && pathname.includes("/Browse/")) {
            router.push('/Browse');
        }

    };

    const typePath = selectedKeys.typeSearch.has("Anime") ? "/anime/" : "/manga/"



    const [isToggle, setToggle] = useState({});

    const handleToggleChange = (key, newToggle) => {
        setToggle((prev) => ({
            ...prev,
            [key]: newToggle
        }))
    }





    const svgItems = [
        {
            icon: (
                <svg data-v-4d8937d6="" aria-hidden="true" focusable="false" data-prefix="far" data-icon="smile" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="var(--green)" className="hover-Image"><path data-v-4d8937d6="" fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"></path></svg>
            )
        },
        {
            icon: (
                <svg data-v-4d8937d6="" aria-hidden="true" focusable="false" data-prefix="far" data-icon="meh" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="var(--orange)" className="hover-Image"><path data-v-4d8937d6="" fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm8 144H160c-13.2 0-24 10.8-24 24s10.8 24 24 24h176c13.2 0 24-10.8 24-24s-10.8-24-24-24z"></path></svg>
            )
        },
        {
            icon: (
                <svg data-v-4d8937d6="" aria-hidden="true" focusable="false" data-prefix="far" data-icon="frown" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="var(--red)" className="hover-Image"><path data-v-4d8937d6="" fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z"></path></svg>
            )
        }
    ]


    const content = (item) => {
        const airingAt = item.nextAiringEpisode?.airingAt;
        const timeUntilAiring = airingAt
            ? Math.max(airingAt - Math.floor(Date.now() / 1000), 0) // Time remaining in seconds
            : null;

        // Convert time into days, hours, and minutes
        const days = timeUntilAiring ? Math.floor(timeUntilAiring / 86400) : 0;

        const remainingSeconds = timeUntilAiring ? timeUntilAiring % 86400 : 0;

        const hours = Math.floor(remainingSeconds / 3600); // Liczba godzin
        const minutes = Math.floor((remainingSeconds % 3600) / 60); // Liczba minut
        const seconds = remainingSeconds % 60; // Liczba sekund

        let czas_pozostaly = '';
        let tekst_pozostaly = ''
        if (days > 0) {
            czas_pozostaly = days
            tekst_pozostaly = days === 1 ? 'day' : 'days'
        } else if (days === 0 && hours > 0) {
            czas_pozostaly = hours
            tekst_pozostaly = hours === 1 ? 'hour' : 'hours'
        } else if (hours === 0 && minutes > 0) {
            czas_pozostaly = minutes
            tekst_pozostaly = minutes === 1 ? 'minute' : 'minutes'
        } else if (days === 0 && hours === 0 && minutes === 0 && seconds > 0) {
            czas_pozostaly = seconds
            tekst_pozostaly = seconds === 1 ? 'second' : 'seconds'
        }

        const movie = item.duration;
        const movieHours = Math.floor(movie / 60);
        const remainingMovie = movie % 60;
        const formats = Array.isArray(item.format) ? item.format : [item.format];

        const filteredFormats = formats
            .filter((format) => typeof format === "string" && format !== "") // Ensure format is a non-empty string
            .map((format) =>
                format
                    .replace("ONE_SHOT", "One shot")
                    .replace("MANGA", "Manga")
                    .replace("TV", "TV Show")
                    .replace("NOVEL", "Novel")
            );







        return (
            // Dodano return
            <div className="hover-data-right">
                <div className="hover-header">
                    <div className="date airing">
                        {(item.status !== "FINISHED") ? (
                            item.startDate?.year === null ? (<>TBA</>) :
                                item.nextAiringEpisode ? (
                                    // Jeśli anime ma status "Releasing" i są dostępne informacje o nowym odcinku
                                    (<>Ep {item.nextAiringEpisode.episode} airing in {czas_pozostaly} {tekst_pozostaly}</>)
                                ) : (
                                    (item.status === "RELEASING" && item.startDate?.year < 2000) ? (

                                        <>{selectedKeys.typeSearch.has("Manga") ? `Publishing Since ${item.startDate?.year}` : `Airing Since ${item.startDate?.year}`}
                                        </>

                                    ) : (
                                        <> {item.season
                                            ? `${item.season.charAt(0).toUpperCase()}${item.season.slice(1).toLowerCase()}`
                                            : ""} {selectedKeys.typeSearch.has("Manga") && item.status !== "NOT_YET_RELEASED" ? `Publishing Since ${item.startDate?.year}` : `${item.startDate?.year}`}</>
                                    )


                                )

                        ) : (
                            // Jeśli anime nie ma statusu "Releasing"
                            (item.endDate?.year ? // Jeśli anime zakończone i ma więcej niż 100 odcinków
                                (item.episodes > 100 ? (<>{item.startDate?.year}-{item.endDate?.year}</>) : (<> {item.season
                                    ? `${item.season.charAt(0).toUpperCase()}${item.season.slice(1).toLowerCase()}`
                                    : ""} {selectedKeys.typeSearch.has("Manga") ? `${item.startDate?.year}-${item.endDate?.year}` : `${item.startDate?.year}`}</>)) : // Jeśli brak informacji o sezonie i startDate
                                (<>TBA</>))
                        )}
                    </div>


                    <div className="hover-score">
                        {item.meanScore >= 75 && svgItems[0].icon}
                        {(item.meanScore <= 74 && item.meanScore >= 60) && svgItems[1].icon}
                        {(item.meanScore <= 59 && item.meanScore !== null) && svgItems[2].icon}
                        <span className="percentage">{item.meanScore}{item.meanScore !== null && "%"}</span>
                    </div>
                </div>
                <div className="hover-studios">
                    <span>{item.studios?.edges?.[0]?.node?.name}</span>
                </div>
                <div className="hover-info">
                    <span>{filteredFormats}</span>
                    <span className="separator">{item.episodes !== null && "•"}{(selectedKeys.typeSearch.has("Manga") && item.status === "FINISHED") && "• " + item.chapters + " chapters"}</span>
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
            </div >
        );
    };




    return (
        <>

            <section className={`sHeader sHeaderPC browseSHeader ${pathname.includes("/Browse") ? "grzegorz" : ""} ${focus ? "hiddenArrow" : "hiddenArrow"}`}>

                <div className="headerBody browseHeader">
                    <div className={`dInput`}>

                        <div className={`arrowLeftIcon`}>
                            <motion.svg
                                initial={false}
                                animate={focus ? "arrowActive" : "arrowHidden"}
                                transition={{ duration: 0.2 }}
                                variants={variants}
                                onClick={() => cosik()}
                                version="1.0" xmlns="http://www.w3.org/2000/svg"
                                width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                                preserveAspectRatio="xMidYMid meet" className={`arrowRight`}>

                                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                   fill="currentColor" stroke="none">
                                    <path d="M2058 4727 c-31 -13 -74 -38 -95 -55 -77 -62 -1882 -1878 -1907
-1920 -38 -61 -60 -154 -52 -225 14 -132 -40 -73 1014 -1129 795 -796 975
-971 1020 -994 78 -39 202 -46 285 -14 89 34 153 90 191 169 28 60 31 75 31
161 0 165 16 144 -562 729 -274 278 -534 536 -579 575 -45 40 -118 91 -167
116 l-86 45 1837 5 1837 5 57 23 c81 33 160 108 200 190 30 60 33 75 33 152
-1 70 -5 95 -27 142 -35 76 -99 143 -173 181 l-60 32 -1855 5 -1855 5 95 50
95 49 576 576 c665 664 634 624 634 795 0 89 -3 106 -28 156 -15 31 -50 78
-77 103 -72 68 -126 89 -235 93 -77 3 -98 0 -147 -20z"/>
                                </g>
                            </motion.svg>
                        </div>
                        <motion.div
                            className={`card ${focus ? "focusIcon" : "unFocusIcon"}`}
                            initial={false}
                            animate={focus ? "focused" : "unfocused"}
                            variants={variants}
                            transition={{ duration: 0.3 }}
                        >
                            <input
                                type="text"
                                value={query}
                                onChange={handleChange}

                                onFocus={() => handleFocus(true)}
                                className={`searchInput ${focus ? "focusIcon" : ""}`}
                                placeholder="Search AyoList"
                            />

                            <svg
                                width="800px"
                                height="800px"
                                className={`searchIcon`}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="filterSearchIcon">
                                <motion.svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                            width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                                            preserveAspectRatio="xMidYMid meet" className={`filterIcon2 ${isToggle.toggle ? 'kolorek5' : 'kolorek25'}`}
                                            animate={focus ? "show" : "hid"}
                                            initial={focus}
                                            transition={{ duration: 0.2 }}
                                            variants={variants}
                                            onClick={() => handleToggleChange("toggle", !isToggle.toggle)}
                                >

                                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                       fill="currentColor" stroke="none">
                                        <path d="M1245 4409 c-278 -35 -443 -171 -517 -426 -21 -71 -23 -99 -23 -303
0 -205 2 -232 23 -305 66 -227 206 -361 432 -412 107 -24 444 -24 550 0 177
40 317 142 385 281 45 93 63 164 77 314 12 136 1 319 -28 427 -39 148 -138
282 -251 343 -150 79 -404 111 -648 81z m350 -319 c130 -19 209 -75 235 -169
39 -138 34 -408 -11 -511 -50 -116 -126 -145 -379 -145 -208 0 -278 15 -340
74 -57 54 -72 114 -77 306 -10 373 58 450 402 454 55 0 132 -4 170 -9z"/>
                                        <path d="M2813 3819 c-107 -53 -118 -201 -21 -271 l33 -23 739 -3 739 -2 42
24 c100 59 101 196 2 270 -28 21 -35 21 -760 24 -726 2 -732 2 -774 -19z"/>
                                        <path d="M3475 2170 c-268 -42 -439 -188 -500 -425 -28 -109 -39 -292 -27
-427 20 -212 63 -326 162 -432 118 -126 304 -186 575 -186 347 0 558 100 661
314 57 119 69 192 69 436 0 195 -2 223 -23 295 -65 225 -206 361 -427 411 -83
18 -401 27 -490 14z m449 -336 c78 -23 128 -71 151 -144 13 -40 19 -100 22
-215 7 -249 -25 -358 -119 -406 -56 -29 -173 -48 -288 -48 -246 -1 -364 52
-400 178 -24 83 -33 237 -22 350 18 179 64 254 175 285 79 23 100 24 267 21
114 -2 171 -8 214 -21z"/>
                                        <path d="M776 1577 c-101 -58 -102 -197 -3 -271 28 -21 36 -21 759 -24 724 -2
731 -2 774 19 108 52 120 201 22 271 l-33 23 -740 2 -740 3 -39 -23z"/>
                                    </g>
                                </motion.svg>
                            </div>
                        </motion.div>




                    </div>
                    <div className={` browseChujec ${pathname.includes("/Browse/") ? "dzialac20" : ""} ${pathname === "/Browse" ? "dzialac20" : ""} ${isToggle.toggle ? "" : "hiddenChuj"}`}>
                        <p className="browseSelect">Browse</p>

                        <Dropdown className="dropDown">
                            <DropdownTrigger className="dropDownTrigger">
                                <div className="browseContainer5">
                                    <button className="browseButton" variant="bordered">{typeSearchValue}</button>
                                    <svg data-v-322766c0="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="iconSvgBrowse"><path data-v-322766c0="" fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>
                                </div>

                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions"
                                          disallowEmptySelection={true}
                                          variant="flat"
                                          closeOnSelect={false}
                                          className="menuDropdown xdd"
                                          selectionMode="single"
                                          selectedKeys={selectedKeys.typeSearch} onSelectionChange={(keys) => handleSelectionChange("typeSearch", keys)} >
                                {typeSearchTab.map((item) => {
                                    return (
                                        <DropdownItem className="dropDownItem" textValue={item} key={item.key}>{item.name}</DropdownItem>
                                    )
                                })}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className={`filters ${pathname.includes("/Browse/") ? "dzialac200" : ""} ${pathname === "/Browse" ? "dzialac200" : ""} ${isToggle.toggle ? "" : "hiddenChuj"}`}

                    >

                        {isClass && <div className={`filter filter-select`}>
                            <div className="filterName">Search</div>
                            <div className="search-wrap2">
                                <svg data-v-84c4e64c="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="ikonka chujec"><path data-v-84c4e64c="" className="ikonka" fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>
                                <input value={query}
                                       onChange={handleChange} type="search" placeholder="Search" autoComplete="off" className="filterSearch" />
                                <svg onClick={() => setQueryClear()} data-v-17620a08="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="ikonkaX ikonkaFilter"><path data-v-17620a08="" fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
                            </div>
                        </div>}

                        <Dropdown className="dropDown"
                        >
                            <div className="filter filter-select">
                                <div className="filterName">Genres</div>
                                <DropdownTrigger className="dropDownTrigger">

                                    <div className="select-wrap">
                                        <div className="selectFilter">
                                            <div className="value-wrap">
                                                <div className="placeholder">{genresValue}</div>
                                                <div className="filter">
                                                </div>
                                            </div>
                                            <svg data-v-e3e1e202="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="arrowFilter"><path data-v-e3e1e202="" fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>

                                        </div>

                                    </div>

                                </DropdownTrigger>

                            </div>

                            {loadingGenres && <p style={{
                                color: "white"
                            }}></p>}
                            {errorGenres && <p style={{
                                color: "white"
                            }}>error {errorGenres.message}</p>}

                            <DropdownMenu className="menuDropdown" aria-label="Single selection example"
                                          variant="flat"
                                          disallowEmptySelection={false}
                                          closeOnSelect={false}
                                          selectionMode="multiple"
                                          selectedKeys={selectedKeys.genres}
                                          onSelectionChange={(keys) => handleSelectionChange("genres", keys)}
                            >

                                {dataGenres?.GenreCollection.map((item) => {

                                    return (
                                        <DropdownItem onClick={() => onClickChange()} className="dropDownItem" key={item}>{item}</DropdownItem>
                                    )
                                })}

                            </DropdownMenu>
                        </Dropdown>
                        {selectedKeys.typeSearch.has("Anime") && <Dropdown className="dropDown">
                            <div className="filter filter-select">
                                <div className="filterName">Year</div>
                                <DropdownTrigger>

                                    <div className="select-wrap">
                                        <div className="selectFilter">
                                            <div className="value-wrap">
                                                <div className="placeholder">{yearValue}</div>
                                                <div className="filter">
                                                </div>
                                            </div>
                                            <svg data-v-e3e1e202="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="arrowFilter"><path data-v-e3e1e202="" fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>

                                        </div>

                                    </div>

                                </DropdownTrigger>

                            </div>
                            <DropdownMenu aria-label="Single selection example"
                                          variant="flat"
                                          className="menuDropdown"
                                          disallowEmptySelection={false}
                                          closeOnSelect={false}
                                          selectionMode="single"
                                          selectedKeys={selectedKeys.year}
                                          onSelectionChange={(keys) => handleSelectionChange("year", keys)}
                            >
                                {years.map((item) => {
                                    return (
                                        <DropdownItem onClick={() => onClickChange()} className="dropDownItem" textValue={item} key={item}>{item}</DropdownItem>
                                    )
                                })}

                            </DropdownMenu>
                        </Dropdown>}


                        {selectedKeys.typeSearch.has("Manga") && <Dropdown className="dropDown">
                            <div className="filter filter-select">
                                <div className="filterName">Country of origin</div>
                                <DropdownTrigger>

                                    <div className="select-wrap">
                                        <div className="selectFilter">
                                            <div className="value-wrap">
                                                <div className="placeholder">{countryValue}</div>
                                                <div className="filter">
                                                </div>
                                            </div>
                                            <svg data-v-e3e1e202="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="arrowFilter"><path data-v-e3e1e202="" fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>

                                        </div>

                                    </div>

                                </DropdownTrigger>

                            </div>

                            <DropdownMenu aria-label="Single selection example"
                                          variant="flat"
                                          className="menuDropdown"
                                          disallowEmptySelection={false}
                                          closeOnSelect={false}
                                          selectionMode="single"
                                          selectedKeys={selectedKeys.country}
                                          onSelectionChange={(keys) => handleSelectionChange("country", keys)}
                            >
                                {CountryOfOriginTab.map((item) => {
                                    return (
                                        <DropdownItem onClick={() => onClickChange()} className="dropDownItem" textValue={item.name} key={item.key}>{item.name}</DropdownItem>
                                    )
                                })}

                            </DropdownMenu>
                        </Dropdown>
                        }

                        {selectedKeys.typeSearch.has("Manga") && <Dropdown className="dropDown" >
                            <div className="filter filter-select">
                                <div className="filterName">Publishing Status</div>
                                <DropdownTrigger>

                                    <div className="select-wrap">
                                        <div className="selectFilter">
                                            <div className="value-wrap">
                                                <div className="placeholder">{statusValue}</div>
                                                <div className="filter">
                                                </div>
                                            </div>
                                            <svg data-v-e3e1e202="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="arrowFilter"><path data-v-e3e1e202="" fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>

                                        </div>

                                    </div>

                                </DropdownTrigger>

                            </div>
                            <DropdownMenu aria-label="Single selection example"
                                          variant="flat"
                                          className="menuDropdown"
                                          disallowEmptySelection={false}
                                          closeOnSelect={false}
                                          selectionMode="single"
                                          selectedKeys={selectedKeys.status}
                                          onSelectionChange={(keys) => handleSelectionChange("status", keys)}
                            >
                                {statusTab.map((item) => {
                                    return (
                                        <DropdownItem onClick={() => onClickChange()} className="dropDownItem" textValue={item} key={item.key}>{item.name}</DropdownItem>
                                    )
                                })}

                            </DropdownMenu>
                        </Dropdown>}

                        {selectedKeys.typeSearch.has("Anime") && <Dropdown className="dropDown" >
                            <div className="filter filter-select">
                                <div className="filterName">Season</div>
                                <DropdownTrigger>

                                    <div className="select-wrap">
                                        <div className="selectFilter">
                                            <div className="value-wrap">
                                                <div className="placeholder">{seasonValue}</div>
                                                <div className="filter">
                                                </div>
                                            </div>
                                            <svg data-v-e3e1e202="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="arrowFilter"><path data-v-e3e1e202="" fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>

                                        </div>

                                    </div>

                                </DropdownTrigger>

                            </div>
                            <DropdownMenu aria-label="Single selection example"
                                          variant="flat"
                                          className="menuDropdown"
                                          disallowEmptySelection={false}
                                          closeOnSelect={false}
                                          selectionMode="single"
                                          selectedKeys={selectedKeys.season}

                                          onSelectionChange={(keys) => handleSelectionChange("season", keys)}
                            >
                                {SeasonTab.map((item) => {
                                    return (
                                        <DropdownItem onClick={() => onClickChange()} className="dropDownItem" textValue={item} key={item.key}>{item.name}</DropdownItem>
                                    )
                                })}

                            </DropdownMenu>
                        </Dropdown>}




                        <Dropdown className="dropDown">
                            <div className="filter filter-select">
                                <div className="filterName">Format</div>
                                <DropdownTrigger>

                                    <div className="select-wrap">
                                        <div className="selectFilter">
                                            <div className="value-wrap">
                                                <div className="placeholder">{formatValue}</div>
                                                <div className="filter">
                                                </div>
                                            </div>
                                            <svg data-v-e3e1e202="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="arrowFilter"><path data-v-e3e1e202="" fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>

                                        </div>

                                    </div>

                                </DropdownTrigger>

                            </div>
                            <DropdownMenu aria-label="Single selection example"
                                          variant="flat"
                                          className="menuDropdown"
                                          disallowEmptySelection={false}
                                          closeOnSelect={false}
                                          selectionMode="single"
                                          selectedKeys={selectedKeys.format}
                                          onSelectionChange={(keys) => handleSelectionChange("format", keys)}
                            >
                                {(selectedKeys.typeSearch.has("Manga") ? mangaFormat : formatTab).map((item) => {
                                    return (
                                        <DropdownItem onClick={() => onClickChange()} className="dropDownItem" textValue={item} key={item.key
                                        }> {item.name}</DropdownItem>
                                    )
                                })}

                            </DropdownMenu>
                        </Dropdown>






                    </div>



                    <div className="filterBox">
                        <div className={`filterActive ${isToggle.toggle ? "" : "chujec50"}`}>
                            < svg data-v-cd1dc2b6="" aria-hidden="true" style={{
                                display: hasVisibleTags === 1 ? "" : "none",
                                marginBottom: "12px",
                                marginRight: "12px"
                            }} focusable="false" data-prefix="fas" data-icon="tags" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="iconTagSvg"><path data-v-cd1dc2b6="" fill="currentColor" d="M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z"></path></svg>
                            {tagsValue()}

                            <button
                                style={{
                                    display: query !== "" ? "" : "none"
                                }}
                                className="filterButton"
                                onClick={() => setQueryClear("")}>
                                Search: {query}
                                <svg data-v-cd1dc2b6="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="iconFilterSvg"><path data-v-cd1dc2b6="" className="iconFilterSvg" fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
                            </button>

                            <button
                                style={{
                                    display: hasVisibleTags >= 2 ? "" : "none",
                                    background: "#99f6e4"
                                }}
                                className="filterButton"
                                onClick={() => handleRemoveAllTags()}>
                                Clear All
                                <svg data-v-cd1dc2b6="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="iconFilterSvg"><path data-v-cd1dc2b6="" className="iconFilterSvg" fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
                            </button>
                        </div>



                        <Dropdown className={`selects-wrap`}>
                            <DropdownTrigger>
                                <div style={{
                                    marginBottom: "12px"
                                }} className={`selects-wrap  ${pathname.includes("/Browse/") ? "dzialacChuj" : ""} ${isToggle.toggle ? "" : "hidden"}`}>
                                    <svg data-v-952b18ba="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="iconSelectSvg"><path data-v-952b18ba="" fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path></svg>
                                    <span className="label">{selectedKeys.sort}</span>
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Single selection example"
                                          variant="flat"
                                          className="menuDropdown"
                                          disallowEmptySelection={false}
                                          closeOnSelect={false}
                                          selectionMode="single"
                                          selectedKeys={selectedKeys.sort}
                                          onSelectionChange={(keys) => handleSelectionChange("sort", keys)}
                            >
                                {sortTab.map((item) => {
                                    return (
                                        <DropdownItem className="dropDownItem" textValue={item} key={item.name
                                        }> {item.name}</DropdownItem>
                                    )
                                })}

                            </DropdownMenu>
                        </Dropdown>



                    </div>











                    {/* Header Text */}
                    <motion.div className={`headerText ${focus && !pathname.includes("/Browse") ? "containerHidden" : ""}`}
                                variants={variants}
                                initial={false}
                                animate={focus || pathname.includes("/Browse") ? "hidSection" : "showSection"}
                                transition={{ duration: 0 }}>
                        <h2>
                            What you are
                            <br />
                            looking for?
                        </h2>
                        <p>Find your favorite Anime Between more Than 10,000 Anime</p>
                    </motion.div>
                </div>
            </section >




            {showResults && query && data?.Page?.media?.length > 0 && (
                <motion.section className={`sMain ${isClass && pathname === "/" ? "cos123" : ""}`}
                                animate={focus || pathname.includes("/Browse") ? "showSection" : "hidSection"}
                                initial={false}
                                variants={variants}
                                transition={{ duration: 0 }}
                >
                    <main className={` ${pathname.includes("/Browse") ? "mainBrowse" : ""}`}>

                        <div className="showAll">


                            {selectedKeys.typeSearch.has("Anime") && <h2><span> {season2} </span>{year} {selectedKeys.typeSearch.has("Anime") ? "Anime" : "Manga"}</h2>}
                            {selectedKeys.typeSearch.has("Manga") && <h2><span></span>{selectedKeys.typeSearch.has("Anime") ? "Anime" : "Manga"}</h2>}
                            < a href="">
                                {!isVisible && <p>View All</p>}
                                {!isVisible && <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                                    width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                                                    preserveAspectRatio="xMidYMid meet" className="arrow" >

                                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                       fill="currentColor" className="arrow" stroke="none">
                                        <path d="M1400 5098 c-44 -17 -77 -44 -171 -137 -144 -143 -163 -177 -164
-286 0 -58 5 -91 19 -120 13 -27 333 -355 995 -1018 l976 -977 -977 -978
c-760 -760 -982 -987 -997 -1022 -14 -30 -21 -67 -21 -110 0 -103 29 -153 168
-291 98 -97 127 -119 175 -137 73 -28 131 -28 204 -1 56 20 108 71 1230 1193
1297 1296 1223 1214 1223 1346 0 132 74 50 -1223 1346 -1123 1123 -1174 1173
-1230 1193 -72 26 -136 26 -207 -1z"/>
                                    </g>

                                </svg>}

                            </a>


                        </div>

                        <br />



                        {/* Results Section */}
                        {loading && <p style={{
                            color: "white"
                        }}></p>}
                        {error && <p style={{
                            color: "white"
                        }}>error {error.message}</p>}



                        <div
                            className={`results ${pathname.includes("/Browse") ? "Browse" : ""}`}
                            color="secondary"
                        >
                            {data?.Page?.media?.map((item) => {



                                return (
                                    <Tooltip
                                        key={item.id}
                                        showArrow={true}
                                        placement="right-start"
                                        closeDelay={150}
                                        delay={50}
                                        color="foreground"
                                        content={content(item)}
                                        offset={30}
                                        style={{
                                            zIndex: "1",
                                        }}
                                    >
                                        <div className="media-card" color="secondary">
                                            <Link className="resultCover" href={`${typePath}${item.id}`}>
                                                <img className="resultImg" src={item.coverImage.extraLarge} alt={item.title.romaji} />
                                            </Link>

                                            <Link href={`${typePath}${item.id}`} className="resultTitle min-h-[46px]">
                                                <div className="resultCircle">
                                                    {item.title?.english === null ? item.title?.romaji : item.title?.english}

                                                </div>

                                            </Link>
                                            {item.meanScore !== null &&<div className="flex justify-start items-center gap-1">
                                                <img src="/images/star.svg" className="star" alt="" />
                                                {item.meanScore !== null && <span className="text-[0.8rem]">{item.meanScore}{item.meanScore !== null && "%"}</span>}
                                            </div>}
                                        </div>
                                    </Tooltip>
                                );
                            })}
                            <div className="barValue" color="secondary">

                            </div>
                        </div>



                        {showResults && query && !loading && !data?.Page?.media?.length && <p style={{
                            color: "white"
                        }}>No results found</p>}
                    </main>
                </motion.section >
            )
            }



            <motion.section className={`sMain  ${focus && !pathname.includes("/Browse") ? "cos123" : ""}`}
                            animate={focus && !pathname.includes("/Browse/") && !isVisible || pathname.includes("/Browse") && !pathname.includes("/Browse/") && !isVisible ? "showSection" : "hidSection"}
                            initial={false}
                            variants={variants}
                            transition={{ duration: 0 }}
            >
                <motion.main className={` ${pathname.includes("/Browse") ? "mainBrowse" : ""}`} initial={false}
                             variants={variants}
                             animate={showResults ? "hid" : ""}
                             transition={{ duration: 0.3 }}>


                    <div className="showAll">

                        <h2><span>Popular </span>now</h2>

                        <Link href={selectedKeys.typeSearch.has("Manga") ? "/Browse/popularManga" : "/Browse/popularAll"}><p>View All</p></Link>






                    </div>

                    <br />



                    <div className={`results ${pathname.includes("/Browse") ? "Browse" : ""}`}>


                        {PopularError && <p style={{
                            color: "white"
                        }}>error {PopularError.message}</p>}
                        {PopularLoading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <motion.div key={index} className="media-card" >

                                    <div className="resultCover resultCover2"></div>
                                    <p className="skeleton-text skeleton-textCHUJ2"></p>
                                </motion.div>
                            ))
                        ) : (
                            PopularData?.Page?.media.slice(0, 6).map((item) => {

                                return (
                                    <Tooltip
                                        key={item.id}
                                        showArrow={true}
                                        placement="right-start"
                                        closeDelay={150}
                                        delay={50}
                                        color="foreground"
                                        content={content(item)}
                                        offset={30}
                                        style={{
                                            zIndex: "1",
                                        }}
                                    >
                                        <motion.div className="media-card" key={item.id}>
                                            <Link className="resultCover" href={`${typePath}${item.id}`}>
                                                <img className="resultImg" src={item.coverImage.extraLarge} alt={item.title.romaji} />
                                            </Link>

                                            <Link href={`${typePath}${item.id}`} className="resultTitle min-h-[46px]">
                                                <div className="resultCircle">
                                                    {item.title?.english === null ? item.title?.romaji : item.title?.english}

                                                </div>

                                            </Link>
                                            {item.meanScore !== null &&<div className="flex justify-start items-center gap-1">
                                                <img src="/images/star.svg" className="star" alt="" />
                                                {item.meanScore !== null && <span className="text-[0.8rem]">{item.meanScore}{item.meanScore !== null && "%"}</span>}
                                            </div>}
                                        </motion.div>
                                    </Tooltip>
                                )

                            })
                        )}


                    </div>
                </motion.main>
            </motion.section >

            <motion.section className={`sMain ${focus && !pathname.includes("/Browse") ? "cos123" : ""} `}
                            animate={focus || pathname.includes("/Browse") ? "showSection" : "hidSection"}
                            initial={false}
                            variants={variants}
                            transition={{ duration: 0 }}
            >
                <motion.main className={` ${pathname.includes("/Browse") ? "mainBrowse" : ""}`} initial={false}
                             variants={variants}
                             animate={showResults ? "hid" : ""}
                             transition={{ duration: 0.3 }}>

                    <div className="showAll">

                        {(!pathname.includes("/Browse/")) && (
                            <>
                                {selectedKeys.typeSearch.has("Anime") && clearTag <= 1 && (
                                    <h2>
                                        <span>{isVisible ? season2 : season} </span>
                                        {isVisible ? year : seasonYear} Anime
                                    </h2>
                                )}
                                {selectedKeys.typeSearch.has("Manga") && clearTag <= 1 && (
                                    <h2>
                                        <span>Popular</span> Manhwa
                                    </h2>
                                )}
                                {selectedKeys.typeSearch.has("Manga") && clearTag >= 2 && (
                                    <h2>
                                        <span></span>
                                        {isVisible ? year : seasonYear} Manga
                                    </h2>
                                )}
                                {selectedKeys.typeSearch.has("Anime") && clearTag >= 2 && (
                                    <h2>
                                        <span>{isVisible ? season2 : season} </span>
                                        {isVisible ? year : seasonYear} Anime
                                    </h2>
                                )}
                            </>
                        )}




                        <Link href={selectedKeys.typeSearch.has("Manga") ? "/Browse/seasonalManga" : "/Browse/seasonalAll"}>{!isVisible && !pathname.includes("/Browse/") && <p>View All</p>}</Link>







                    </div>

                    <br />



                    <div className={`results ${pathname.includes("/Browse") ? "Browse" : ""} ${pathname.includes("/Browse/") ? "BrowseChujec123" : ""} `}>

                        {seasonalError && <p style={{
                            color: "white"
                        }}>error {seasonalError.message}</p>}
                        {(pathname === "/Browse/emissionAll" || pathname === "/") ? (
                            seasonalLoading ? (
                                Array.from({ length: 20 }).map((_, index) => (
                                    <div key={index} className="media-card">
                                        <div className="resultCover resultCover2"></div>
                                        <p className="skeleton-text skeleton-textCHUJ2"></p>
                                    </div>
                                ))
                            ) : (
                                seasonalData?.Page?.media.slice(0, hasVisibleTags >= 1 || pathname.includes("/Browse/") ? undefined : 6).map((item) => {
                                    const airingAt = item.nextAiringEpisode?.airingAt;
                                    const timeUntilAiring = airingAt
                                        ? Math.max(airingAt - Math.floor(Date.now() / 1000), 0) // Time remaining in seconds
                                        : null;

                                    // Convert time into days, hours, and minutes
                                    const days = timeUntilAiring ? Math.floor(timeUntilAiring / 86400) : 0;
                                    const hours = timeUntilAiring ? Math.floor((timeUntilAiring % 86400) / 3600) : 0;
                                    const minutes = timeUntilAiring ? Math.floor((timeUntilAiring % 3600) / 60) : 0;





                                    return (

                                        <div className="media-card" key={item.id}>
                                            <Link className="resultCover" href={`${typePath}${item.id}`}>
                                                <img className="resultImg" src={item.coverImage.extraLarge} alt={item.title.romaji} />
                                            </Link>

                                            <Link href={`${typePath}${item.id}`} className="resultTitle">
                                                <div className="resultCircle">
                                                    {timeUntilAiring !== null ? (
                                                        <p className="chujWdupie">{`${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`}</p>
                                                    ) : (
                                                        <p className="chujWdupie">No information</p>
                                                    )}

                                                    <div className="chuj3">
                                                        {item.meanScore !== null &&<>
                                                            <img src="/images/star.svg" className="star" alt="" />
                                                            {item.meanScore !== null && <span className="chuj25">{item.meanScore}{item.meanScore !== null && "%"}</span>}
                                                        </>}
                                                        <p className="chuj25">Ep</p>
                                                        <span className="krzywychuj">{item.nextAiringEpisode?.episode} </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })
                            )
                        ) : (

                            seasonalLoading ? (
                                Array.from({ length: !pathname.includes("/Browse/") ? 6 : 20 }).map((_, index) => (
                                    <motion.div key={index} className="media-card">
                                        <div className="resultCover resultCover2"></div>
                                        <p className="skeleton-text skeleton-textCHUJ2"></p>
                                    </motion.div>
                                ))
                            ) : (

                                seasonalData?.Page?.media.slice(0, hasVisibleTags >= 1 || pathname.includes("/Browse/") ? undefined : 6).map((item) => {


                                    return (
                                        <Tooltip
                                            showArrow={true}
                                            placement="right-start"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content(item)}
                                            offset={30}
                                            key={item.id}
                                            style={{
                                                zIndex: "1",
                                            }}

                                        >

                                            <motion.div className="media-card" key={item.id}>
                                                <Link className="resultCover" href={`${typePath}${item.id}`}>
                                                    <img className="resultImg" src={item.coverImage.extraLarge} alt={item.title.romaji} />
                                                </Link>

                                                <Link href={`${typePath}${item.id}`} className="resultTitle min-h-[46px]">
                                                    <div className="resultCircle">
                                                        {item.title?.english === null ? item.title?.romaji : item.title?.english}

                                                    </div>

                                                </Link>
                                                {item.meanScore !== null &&<div className="flex justify-start items-center gap-1">
                                                    <img src="/images/star.svg" className="star" alt="" />
                                                    {item.meanScore !== null && <span className="text-[0.8rem]">{item.meanScore}{item.meanScore !== null && "%"}</span>}
                                                </div>}
                                            </motion.div>
                                        </Tooltip>)



                                })
                            )
                        )}
                        {isLoading && Array.from({ length: 6 }).map((_, index) => (
                            <motion.div key={index} className="media-card">
                                <div className="resultCover resultCover2"></div>
                                <p className="skeleton-text skeleton-textCHUJ2"></p>
                            </motion.div>
                        ))}


                    </div>
                </motion.main>

            </motion.section >

            {
                selectedKeys.typeSearch.has("Anime") && <motion.section className={`sMain ${focus && !pathname.includes("/Browse") ? "cos123" : ""} `}
                                                                        animate={focus && !pathname.includes("/Browse/") && !isVisible || pathname.includes("/Browse") && !pathname.includes("/Browse/") && !isVisible ? "showSection" : "hidSection"}
                                                                        initial={false}
                                                                        variants={variants}
                                                                        transition={{ duration: 0 }}
                >
                    <motion.main className={` ${pathname.includes("/Browse") ? "mainBrowse" : ""}`} initial={false}
                                 variants={variants}
                                 animate={showResults ? "hid" : ""}
                                 transition={{ duration: 0.3 }}>

                        <div className="showAll">
                            <h2><span>Up</span>coming</h2>
                            <Link href={"/Browse/upcomingAll"}><p>View All</p></Link>



                        </div>

                        <br />



                        <div className={`results ${pathname.includes("/Browse") ? "Browse" : ""}`}>
                            {nextError && <p style={{
                                color: "white"
                            }}>error {nextError.message}</p>}
                            {nextLoading ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <motion.div key={index} className="media-card" >

                                        <div className="resultCover resultCover2"></div>
                                        <p className="skeleton-text skeleton-textCHUJ2"></p>
                                    </motion.div>
                                ))
                            ) : (
                                nextData?.Page?.media.slice(0, 6).map((item) => {


                                    return (

                                        <Tooltip
                                            showArrow={true}
                                            placement="right-start"
                                            closeDelay={150}
                                            delay={50}
                                            color="foreground"
                                            content={content(item)}
                                            offset={30}
                                            key={item.id}
                                            style={{
                                                zIndex: "1",
                                            }}

                                        >

                                            <motion.div className="media-card" key={item.id}
                                            >
                                                <Link className="resultCover" href={`${typePath}${item.id}`}>
                                                    <img className="resultImg" src={item.coverImage.extraLarge} alt={item.title.romaji} />
                                                </Link>

                                                <Link href={`${typePath}${item.id}`} className="resultTitle min-h-[46px]">
                                                    <div className="resultCircle">
                                                        {item.title?.english === null ? item.title?.romaji : item.title?.english}

                                                    </div>

                                                </Link>
                                                {item.meanScore !== null &&<div className="flex justify-start items-center gap-1">
                                                    <img src="/images/star.svg" className="star" alt="" />
                                                    {item.meanScore !== null && <span className="text-[0.8rem]">{item.meanScore}{item.meanScore !== null && "%"}</span>}
                                                </div>}
                                            </motion.div>
                                        </Tooltip>

                                    )

                                })
                            )}


                        </div>
                    </motion.main>
                </motion.section >
            }


            <motion.section className={`sMain ${focus && !pathname.includes("/Browse") ? "cos123" : ""}  `}
                            animate={focus && !pathname.includes("/Browse/") && !isVisible || pathname.includes("/Browse") && !pathname.includes("/Browse/") && !isVisible ? "showSection" : "hidSection"}
                            initial={false}
                            variants={variants}
                            transition={{ duration: 0 }}
            >
                <motion.main className={` ${pathname.includes("/Browse") ? "mainBrowse" : ""}`} initial={false}
                             variants={variants}
                             animate={showResults ? "hid" : ""}
                             transition={{ duration: 0.3 }}>

                    <div className="showAll">
                        <h2><span>ALL TIME</span> POPULAR</h2>
                        <Link href={selectedKeys.typeSearch.has("Manga") ? "/Browse/alltimeManga" : "/Browse/alltimeAll"}><p>View All</p></Link>



                    </div>

                    <br />



                    <div className={`results ${pathname.includes("/Browse") ? "Browse" : ""}`}>
                        {allTimeError && <p style={{
                            color: "white"
                        }}>error {allTimeError.message}</p>}
                        {allTimeLoading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <motion.div key={index} className="media-card" >

                                    <div className="resultCover resultCover2"></div>
                                    <p className="skeleton-text skeleton-textCHUJ2"></p>
                                </motion.div>
                            ))
                        ) : (
                            allTimeData?.Page?.media.slice(0, 6).map((item) => {


                                return (
                                    <Tooltip
                                        showArrow={true}
                                        placement="right-start"
                                        closeDelay={150}
                                        delay={50}
                                        color="foreground"
                                        content={content(item)}
                                        offset={30}
                                        key={item.id}
                                        style={{
                                            zIndex: "1",
                                        }}

                                    >

                                        <motion.div className="media-card" key={item.id}
                                        >
                                            <Link className="resultCover" href={`${typePath}${item.id}`}>
                                                <img className="resultImg" src={item.coverImage.extraLarge} alt={item.title.romaji} />
                                            </Link>

                                            <Link href={`${typePath}${item.id}`} className="resultTitle min-h-[46px]">
                                                <div className="resultCircle">
                                                    {item.title?.english === null ? item.title?.romaji : item.title?.english}

                                                </div>

                                            </Link>
                                            {item.meanScore !== null &&<div className="flex justify-start items-center gap-1">
                                                <img src="/images/star.svg" className="star" alt="" />
                                                {item.meanScore !== null && <span className="text-[0.8rem]">{item.meanScore}{item.meanScore !== null && "%"}</span>}
                                            </div>}
                                        </motion.div>
                                    </Tooltip>

                                )


                            })
                        )}


                    </div>
                </motion.main>
            </motion.section >
        </>
    );
}
