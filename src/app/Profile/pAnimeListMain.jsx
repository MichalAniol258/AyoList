"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import { usePathname } from "next/navigation";
import { useUserContext } from "../components/userListWrapper"
import { useUser } from "./../components/userInfoWrapper";
import { gql, useMutation } from "@apollo/client";
import { Calendar } from "@heroui/react";
import { parseDate } from '@internationalized/date';
import Link from "next/link";
const SAVE_MEDIA_LIST_ENTRY = gql`
mutation Mutation($mediaId: Int, $status: MediaListStatus, $score: Float, $progress: Int, $repeat: Int, $notes: String, $completedAt: FuzzyDateInput, $startedAt: FuzzyDateInput, $progressVolumes: Int) {
  SaveMediaListEntry(mediaId: $mediaId, status: $status, score: $score, progress: $progress, repeat: $repeat, notes: $notes, completedAt: $completedAt, startedAt: $startedAt, progressVolumes: $progressVolumes) {
    id
    score
    status
    repeat
    progress
    notes
    progressVolumes
  }
}
`;

const SAVE_PROGRESS = gql`
mutation Mutation($mediaId: Int, $progress: Int, ) {
  SaveMediaListEntry(mediaId: $mediaId, progress: $progress, ) {
    id
    progress
  }
}
`;


const DELETE_MEDIA_LIST_ENTRY = gql`
  mutation Mutation($deleteMediaListEntryId: Int) {
    DeleteMediaListEntry(id: $deleteMediaListEntryId) {
      deleted
    }
  }
`;


const SAVE_FAVOURITE = gql`
mutation Mutation($animeId: Int, $mangaId: Int) {
  ToggleFavourite(animeId: $animeId, mangaId: $mangaId) {
    anime {
      nodes {
        isFavourite
        id
      }
    }
    manga {
      nodes {
        isFavourite
        id
      }
    }
  }
}
`;



const menuVariants = {
    closed: {
        scale: 0,
        opacity: 0,
        transition: {
            delay: 0.15,
        },
    },
    open: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            duration: 0.4,
            delayChildren: 0.2,
            staggerChildren: 0.05,
        },
    },
};

const iconVariants = {
    iconClosed: {
        rotate: 0,
        transition: {
            duration: 0.1
        }
    },
    iconOpen: {
        rotate: 180,
        transition: {
            duration: 0.1
        }
    }
}

const itemVariants = {
    closed: { x: -16, opacity: 0 },
    open: { x: 0, opacity: 1 },
};

export default function PAnimeListMain() {
    let pathname = usePathname()
    const [selectedSort, setSelectedSort] = useState('Sort');
    const { userList, userListManga, GET_MEDIA_PROVIDER } = useUserContext();
    const cos = pathname === "/Profile/Animelist" ? userList : userListManga

    let [defaultValue, setDefaultValue] = useState();
    let [defaultValue2, setDefaultValue2] = useState();




    const [hoveredTheme, setHoveredTheme] = useState(1)

    const [value, setValue] = useState('')

    function clearInput() {
        setValue('')
    }



    const [editData, setEditData] = useState({
        mediaId: 0,
        status: "",
        score: 0,
        progress: 0,
        notes: "",
        repeat: 0,
        name: "",
        img: "",
        banner: "",
        favourite: false,
        episodes: 0,
        chapters: 0,
        volumes: 0,
    });



    const filterOption = ["All", "Watching", "Completed", "Dropped", "Planning", "Paused", "Rewatching"];



    const mangaFilterOption = ["All", "Reading", "Completed", "Dropped", "Planning", "Paused", "Rereading"];

    const filter = pathname === "/Profile/Mangalist" ? mangaFilterOption : filterOption;


    const [isToggleOption, setToggleOption] = useState(filter[0]);



    function handleToggleOption(item) {


        setToggleOption(item)
    }






    const [toggles, setToggles] = useState({});
    const [selectedFormat, setSelectedFormat] = useState('Format'); // Domyślny placeholder
    const [selectedStatus, setSelectedStatus] = useState('Status'); // Domyślny placeholder
    const [selectedGenre, setSelectedGenre] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('Country');
    const [selectedStatusS, setSelectedStatusS] = useState('')





    const handleIncrease = (inputId, limit) => {
        setEditData(prevEditData => {
            const currentValue = Number(prevEditData[inputId]) || 0; // Używamy Number() zamiast parseInt()
            const newValue = currentValue < limit ? currentValue + 1 : currentValue;

            return {
                ...prevEditData,
                [inputId]: newValue
            };
        });
    };

    const handleDecrease = (inputId, min) => { // Zmieniamy nazwę limit na min, bo tu chodzi o minimalną wartość
        setEditData(prevEditData => {
            const currentValue = Number(prevEditData[inputId]) || 0;
            const newValue = currentValue > min ? currentValue - 1 : currentValue;

            return {
                ...prevEditData,
                [inputId]: newValue
            };
        });
    };





    const handleToggle = (inputId) => {
        setToggles(prevState => ({
            ...prevState,
            [inputId]: !prevState[inputId],
        }));

    };

    console.log(selectedGenre.length)


    const handleSelectOption = (item, inputId) => {
        const newFormat = selectedFormat === item.key ? 'Format' : item.key;
        const newStatus = selectedStatus === item.key ? 'Status' : item.key;
        const newGenre = selectedGenre.includes(item.key)
            ? selectedGenre.filter(genre => genre !== item.key)
            : [...selectedGenre, item.key];
        const newCountry = selectedCountry === item.key ? "Country" : item.key;
        const newSort = selectedSort === item.key ? "Sort" : item.key;

        if (inputId === "input1") {
            setSelectedFormat(newFormat);
            handleToggle('input1')
        } else if (inputId === "input2") {
            handleToggle('input2')
            setSelectedStatus(newStatus)
        } else if (inputId === "input3") {
            setSelectedGenre(newGenre)
        } else if (inputId === "input4") {
            setSelectedCountry(newCountry)
            handleToggle('input4')
        } else if (inputId === "input5") {
            setSelectedSort(newSort)
            handleToggle('input5')
        } else if (inputId === "inputS") {
            if (selectedStatusS !== item.key) {
                setSelectedStatusS(item.key);
            }
            handleToggle('inputS')
        } else if (inputId === "inputDate") {
            handleToggle('inputDate')
        } else if (inputId === "inputDate2") {
            handleToggle('inputDate2')
        }


    };







    const formatList2 = [
        { key: "TV", label: "TV" },
        { key: "TV_SHORT", label: "TV Short" },
        { key: "MOVIE", label: "Movie" },
        { key: "SPECIAL", label: "Special" },
        { key: "OVA", label: "OVA" },
        { key: "ONA", label: "ONA" },
        { key: "MUSIC", label: "Music" },
    ];

    const formatListManga = [
        { key: "MANGA", label: "Manga" },
        { key: "NOVEL", label: "Light Novel" },
        { key: "ONE_SHOT", label: "One Shot" },
    ];


    const statusList2 = [
        { key: "FINISHED", label: "Finished" },
        { key: "RELEASING", label: "Releasing" },
        { key: "NOT_YET_RELEASED", label: "Not yet released" },
        { key: "CANCELLED", label: "Cancelled" },
        { key: "HIATUS", label: "Hiatus" },
    ];



    const genresList = [
        { key: "Action" },
        { key: "Adventure" },
        { key: "Comedy" },
        { key: "Drama" },
        { key: "Fantasy" },
        { key: "Horror" },
        { key: "Mahou Shoujo" },
        { key: "Mecha" },
        { key: "Music" },
        { key: "Mystery" },
        { key: "Psychological" },
        { key: "Romance" },
        { key: "Sci-Fi" },
        { key: "Slice of Life" },
        { key: "Sports" },
        { key: "Supernatural" },
        { key: "Thriller" }
    ];

    const countryList = [
        { key: 'JP', label: "Japan" },
        { key: 'KR', label: "South Korea" },
        { key: 'CN', label: "China" },
    ]

    const sortList = [
        { key: 'MEDIA_TITLE_ROMAJI_DESC', label: 'Title' },
        { key: 'SCORE_DESC', label: 'Score' },
        { key: 'PROGRESS_DESC', label: "Progress" },
        { key: 'UPDATED_TIME_DESC', label: "Last Updated" },
        { key: 'ADDED_TIME_DESC', label: 'Last Added' },
        { key: 'STARTED_ON_DESC', label: 'Start Date' },
        { key: 'FINISHED_ON_DESC', label: 'Completed Date' },
        { key: 'STARTED_ON', label: 'Release Date' },
        { key: 'AVERAGE_SCORE', label: 'Average Score' },
        { key: 'MEDIA_POPULARITY_DESC', label: 'Popularity' }
    ]

    const statusS = [
        {
            key: 'CURRENT', label: pathname === "/Profile/Animelist" ? 'Watching' : 'Reading',

        },
        {
            key: 'PLANNING', label: 'Planning',

        },
        {
            key: 'COMPLETED', label: 'Completed',

        },
        {
            key: 'DROPPED', label: 'Dropped',

        },
        {
            key: 'PAUSED', label: 'Paused',

        },
        {
            key: 'REPEATING', label: pathname === "/Profile/Animelist" ? 'Rewatching' : 'Rereading'
        }

    ]








    const optionHead = ["Title", "Score", "Progress", "Type"];
    const mangaOptionHead = ["Title", "Score", "Chapters", "Volumes", "Type"];




    function handleClick(newTheme) {
        setHoveredTheme(newTheme);
    }



    const entries = cos?.MediaListCollection?.lists?.flatMap(list => list.entries) || [];

    const currentEntriesCount = entries.filter((entry) => entry.status === "CURRENT").length;
    const completedEntriesCount = entries.filter((entry) => entry.status === "COMPLETED").length;
    const droppedEntriesCount = entries.filter((entry) => entry.status === "DROPPED").length;
    const planningEntriesCount = entries.filter((entry) => entry.status === "PLANNING").length;
    const pausedEntriesCount = entries.filter((entry) => entry.status === "PAUSED").length;
    const repeatingEntriesCount = entries.filter((entry) => entry.status === "REPEATING").length;
    /*
        const allCounts = statuses.reduce((acc, status) => {
            acc[status] = {
                formats: formatList2.reduce((formatAcc, { key }) => {
                    formatAcc[key] = entries.filter(
                        (entry) => entry.status === status && entry.media?.format === key
                    ).length;
                    return formatAcc;
                }, {}),
     
                statuses: statusList2.reduce((statusAcc, { key }) => {
                    statusAcc[key] = entries.filter(
                        (entry) => entry.status === status && entry.media?.status === key
                    ).length;
                    return statusAcc;
                }, {}),
     
                genres: genresList.reduce((genresAcc, { key }) => {
                    genresAcc[key] = entries.filter(
                        (entry) => entry.status === status && entry.media?.genres === key
                    ).length;
                    return genresAcc
                }, {}),
     
                countries: countryList.reduce((countryAcc, { key }) => {
                    countryAcc[key] = entries.filter(
                        (entry) => entry.status === status && entry.media?.countryOfOrigin === key
                    ).length;
                    return countryAcc
                }, {}),
            };
            return acc;
        }, {});
     
     
    */






    const filteredFormats = (item) => {
        const media = item.media;
        let formattedType = media.format;

        if (formattedType === "SPECIAL") {
            formattedType = "Special";
        } else if (formattedType === "TV_SHORT") {
            formattedType = "TV Short";
        } else if (formattedType === "MOVIE") {
            formattedType = "Movie"
        } else if (formattedType === "MUSIC") {
            formattedType = "Music"
        } else if (formattedType === "MANGA") {
            formattedType = "Manga"
        } else if (formattedType === "NOVEL") {
            formattedType = "Novel"
        } else if (formattedType === "ONE_SHOT") {
            formattedType = "One shot"
        }

        return formattedType
    }

    const inputRefs = useRef({})
    const dropdownRefs = useRef({})

    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(inputRefs.current).forEach((inputId) => {
                if (
                    inputRefs.current[inputId] &&
                    !inputRefs.current[inputId].contains(event.target) &&
                    dropdownRefs.current[inputId] &&
                    !dropdownRefs.current[inputId].contains(event.target)
                ) {
                    setToggles((prevState) => ({
                        ...prevState,
                        [inputId]: false,
                    }));
                }
            });
        };


        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    const options = pathname === "/Profile/Mangalist" ? mangaOptionHead : optionHead;

    const format = pathname === "/Profile/Animelist" ? formatList2 : formatListManga;
    const status = pathname === "/Profile/Mangalist" ? statusList2 : statusList2;

    console.log(value)


    let tableStatus = {
        table1: 'CURRENT', // Status dla Tabeli 1
        table6: 'REPEATING',
        table2: 'COMPLETED', // Status dla Tabeli 2
        table5: "PAUSED",
        table3: 'DROPPED', // Status dla Tabeli 3
        table4: 'PLANNING' // Status dla Tabeli 4
    };

    if (isToggleOption === "All") {
        // W przypadku "All", każda tabela dostaje odpowiedni status
        tableStatus = {
            table1: 'CURRENT', // Status dla Tabeli 1
            table6: 'REPEATING',
            table2: 'COMPLETED', // Status dla Tabeli 2
            table5: "PAUSED",
            table3: 'DROPPED', // Status dla Tabeli 3
            table4: 'PLANNING' // Status dla Tabeli 4
        };
    }


    const filteredEntries = entries.filter((entry) => {
        const media = entry.media;
        const formatToCompare = selectedFormat === "Format" ? media.format : selectedFormat;
        const statusToCompare = selectedStatus === "Status" ? media.status : selectedStatus;
        const genresToCompare = selectedGenre === "Genres" ? media.genres : selectedGenre;
        const countryToCompare = selectedCountry === "Country" ? media.countryOfOrigin : selectedCountry;
        const cosik = media.title?.english === null ? media.title?.romaji : media.title?.english

        const genresMatch = Array.isArray(genresToCompare)
            ? genresToCompare.every(genre => media.genres.includes(genre))
            : media.genres.includes(genresToCompare);


        return (
            cosik.toLowerCase().startsWith(value.toLowerCase() || "")
            &&
            media.countryOfOrigin === countryToCompare &&
            genresMatch &&
            media.status === statusToCompare &&
            media.format === formatToCompare
        );
    });

    console.log(isToggleOption)

    // Teraz sortowanie działa na tablicy!
    const sortedEntries = filteredEntries.sort((a, b) => {
        const mediaA = a.media;
        const mediaB = b.media;

        switch (selectedSort) {
            case "MEDIA_TITLE_ROMAJI_DESC":
                // If title?.english is null, use title?.romaji
                const cosikA = a.media.title?.english === null ? a.media.title?.romaji : a.media.title?.english;
                const cosikB = b.media.title?.english === null ? b.media.title?.romaji : b.media.title?.english;

                // Ensure the comparison is in descending order
                return cosikA.localeCompare(cosikB); // Reverse comparison for descending order




            case "SCORE_DESC":
                return (b.score || 0) - (a.score || 0);

            case "PROGRESS_DESC":
                return (b.progress || 0) - (a.progress || 0);

            case "UPDATED_TIME_DESC":
                return (b.updatedAt || 0) - (a.updatedAt || 0);


            case "ADDED_TIME_DESC":
                return (b.createdAt || 0) - (a.createdAt || 0);

            case "STARTED_ON_DESC":
                return new Date(b.startedAt?.year, b.startedAt?.month - 1, b.startedAt?.day) -
                    new Date(a.startedAt?.year, a.startedAt?.month - 1, a.startedAt?.day);

            case "FINISHED_ON_DESC":
                return new Date(b.completedAt?.year, b.completedAt?.month - 1, b.completedAt?.day) -
                    new Date(a.completedAt?.year, a.completedAt?.month - 1, a.completedAt?.day);

            case "STARTED_ON":
                return new Date(b.media.startDate?.year, b.media.startDate?.month - 1, b.media.startDate?.day) -
                    new Date(a.media.startDate?.year, a.media.startDate?.month - 1, a.media.startDate?.day);

            case "AVERAGE_SCORE":
                return (mediaB.meanScore || 0) - (mediaA.meanScore || 0);

            case "MEDIA_POPULARITY_DESC":
                return (mediaB.popularity || 0) - (mediaA.popularity || 0);

            default:
                return 0; // Domyślnie brak sortowania
        }
    });


    const statusCount = sortedEntries.reduce((acc, entry) => {
        acc[entry.status] = (acc[entry.status] || 0) + 1;
        return acc;
    }, {});

    console.log("xddd" + statusCount['PAUSED'])

    const { userInfo } = useUser()

    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleEdit = (mode, item) => {
        if (mode === "edit") {
            console.log("isFavourite:", item?.media?.isFavourite); // Sprawdzenie wartości
            console.log("isFavourite:", item?.mediaId); // Sprawdzenie wartości
            console.log("isFavourite:", item?.id); // Sprawdzenie wartości
            setEditData({
                mediaId: item?.mediaId || 0,
                episodes: item?.media?.episodes || 0,
                chapters: item?.media?.chapters || 0,
                volumes: item?.progressVolumes || 0,
                volumesCount: item?.media?.volumes || 0,
                status: item?.status || "",
                score: item?.score || 0,
                progress: item?.progress || 0,
                notes: item?.notes || "",
                repeat: item?.repeat || 0,
                name: item?.media?.title?.english || item?.media?.title?.romaji || "",
                banner: item?.media?.bannerImage || "",
                img: item?.media?.coverImage?.large || "",
                favourite: item?.media?.isFavourite || false,
                startDateYear: item?.startedAt?.year || 0,
                startDateMonth: item?.startedAt?.month || 0,
                startDateDay: item?.startedAt?.day || 0,
                endDateYear: item?.completedAt?.year || 0,
                endDateMonth: item?.completedAt?.month || 0,
                endDateDay: item?.completedAt?.day || 0,
                id: item?.id || 0

            });
            setIsEditOpen(true);
        } else {
            setIsEditOpen(false);
        }
    };




    useEffect(() => {
        if (isEditOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [isEditOpen]);

    const variants = {
        editActive: { opacity: 1, scale: 1, display: "block" },
        editNah: { opacity: 0, scale: 0.95, transitionEnd: { display: "none" } },
    };


    const [saveMediaListEntry] = useMutation(SAVE_MEDIA_LIST_ENTRY, {
        refetchQueries: [{ query: GET_MEDIA_PROVIDER, variables: { userId: userInfo?.id, type: pathname === "/Profile/Animelist" ? 'ANIME' : 'MANGA', sort: undefined } }],
    });

    const [saveProgress] = useMutation(SAVE_PROGRESS, {
        refetchQueries: [{ query: GET_MEDIA_PROVIDER, variables: { userId: userInfo?.id, type: pathname === "/Profile/Animelist" ? 'ANIME' : 'MANGA', sort: undefined } }],
    });

    const [saveFavourite] = useMutation(SAVE_FAVOURITE, {
        refetchQueries: [{ query: GET_MEDIA_PROVIDER, variables: { userId: userInfo?.id, type: pathname === "/Profile/Animelist" ? 'ANIME' : 'MANGA', sort: undefined } }],
    })

    const [deleteMedia] = useMutation(DELETE_MEDIA_LIST_ENTRY, {
        refetchQueries: [{ query: GET_MEDIA_PROVIDER, variables: { userId: userInfo?.id, type: pathname === "/Profile/Animelist" ? 'ANIME' : 'MANGA', sort: undefined } }],
    })


    const handleDelete = async () => {
        try {
            await deleteMedia({
                variables: {
                    deleteMediaListEntryId: editData.id,
                },
            });

            setIsEditOpen(false);
        } catch (error) {
            console.error('Error during save:', error);
        }
    };


    const handleSave = async () => {
        try {
            await saveMediaListEntry({
                variables: {
                    mediaId: editData.mediaId,
                    status: selectedStatusS,
                    score: editData.score,
                    progress: editData.progress,
                    notes: editData.notes,
                    progressVolumes: editData.volumes,
                    repeat: editData.repeat,
                    completedAt: {
                        year: editData.endDateYear,
                        month: editData.endDateMonth,
                        day: editData.endDateDay
                    },
                    startedAt: {
                        year: editData.endDateYear,
                        month: editData.endDateMonth,
                        day: editData.endDateDay
                    }
                },
            });

            setIsEditOpen(false);
        } catch (err) {
            console.error('Error during save:', err);
        }
    };

    const handleScore = async (item) => {
        try {
            // Upewnij się, że progress jest liczbą
            let currentValue = Number(item?.progress);

            // Określenie maksymalnego limitu
            let maxLimit = item?.media?.episodes || Infinity;  // Jeśli episodes to null lub 0, ustawiamy maxLimit na Infinity

            // Jeśli currentValue jest poza dozwolonym zakresem, ustawiamy odpowiednią wartość
            if (currentValue < 0 || isNaN(currentValue)) {
                currentValue = 0;
            } else if (currentValue > maxLimit) {
                currentValue = maxLimit;
            }

            // Zwiększamy currentValue o 1, jeśli nie osiągnął maxLimit
            if (currentValue < maxLimit) {
                currentValue += 1;
            }

            // Pobieramy mediaId
            const mediaId = item?.media?.id;

            // Wywołanie saveProgress z poprawnymi wartościami
            const response = await saveProgress({
                variables: {
                    mediaId,
                    progress: currentValue,  // Używamy currentValue zamiast progress
                },
            });

            console.log('Response:', response);  // Sprawdź odpowiedź
            console.log(editData.progress);  // Jeśli to jest ważne do sprawdzenia
        } catch (err) {
            console.error('Error during save:', err);  // Obsługa błędów
        }
    };


    let statusText = '';
    let idText = '';
    if (pathname !== "/Profile/Mangalist") {
        switch (isToggleOption) {
            case "All":
            case "Watching":
                idText = "CURRENT";
                break;
            case "Planning":
                idText = "PLANNING";
                break;
            case "Dropped":
                idText = "DROPPED";
                break;
            case "Completed":
                idText = "COMPLETED";
                break;
            case "Paused":
                idText = "PAUSED";
                break;
            case "Rewatching":
                idText = "REPEATING";
                break;
        }
    } else {
        switch (isToggleOption) {
            case "All":
            case "Reading":
                idText = "CURRENT";
                break;
            case "Planning":
                idText = "PLANNING";
                break;
            case "Dropped":
                idText = "DROPPED";
                break;
            case "Completed":
                idText = "COMPLETED";
                break;
            case "Paused":
                idText = "PAUSED";
                break;
            case "Rereading":
                idText = "REPEATING";
                break;
        }
    }


    if (statusCount[idText] > 0) {
        if (pathname !== "/Profile/Mangalist") {
            switch (isToggleOption) {
                case "All":
                case "Watching":
                    statusText = "Watching";
                    break;
                case "Planning":
                    statusText = "Planning";
                    break;
                case "Dropped":
                    statusText = "Dropped";
                    break;
                case "Completed":
                    statusText = "Completed";
                    break;
                case "Paused":
                    statusText = "Paused";
                    break;
                case "Rewatching":
                    statusText = "Rewatching";
                    break;
            }
        } else {
            switch (isToggleOption) {
                case "All":
                case "Reading":
                    statusText = "Reading";
                    break;
                case "Planning":
                    statusText = "Planning";
                    break;
                case "Dropped":
                    statusText = "Dropped";
                    break;
                case "Completed":
                    statusText = "Completed";
                    break;
                case "Paused":
                    statusText = "Paused";
                    break;
                case "Rereading":
                    statusText = "Rereading";
                    break;
            }
        }
    }


    const handleSaveFavourite = async () => {
        try {
            const variables = pathname === '/Profile/Mangalist'
                ? { mangaId: editData.mediaId || 0 }
                : { animeId: editData.mediaId || 0 };

            await saveFavourite({ variables });


            setEditData(prev => ({
                ...prev,
                favourite: !prev.favourite
            }));


        } catch (err) {
            console.error('Error during save:', err);
        }
    };

    const handleExit = () => {
        setIsEditOpen(false)
    }




    let chujec = ''
    if (editData.status === "CURRENT") {
        chujec = pathname === "/Profile/Animelist" ? 'Watching' : 'Reading'
    } else if (editData.status === "PLANNING") {
        chujec = 'Planning'
    } else if (editData.status === "COMPLETED") {
        chujec = "Completed"
    } else if (editData.status === "DROPPED") {
        chujec = 'Dropped'
    } else if (editData.status === "PAUSED") {
        chujec = 'Paused'
    } else if (editData.status === "REPEATING") {
        chujec = pathname === "/Profile/Animelist" ? 'Rewatching' : 'Rereading'
    } else {
        chujec = ''
    }

    console.log(selectedStatusS)

    useEffect(() => {
        setSelectedStatusS(editData.status);
    }, [editData.status]);

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            setIsEditOpen(false);

        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);





    return (


        <>
            <motion.div
                animate={isEditOpen ? "editActive" : "editNah"}
                initial="editNah"
                onKeyDown={handleKeyDown}
                variants={variants}
                transition={{ duration: 0.25, ease: "easeInOut" }} className={`list-editor__wrapper`}>
                <div className="el-dialog list-editor">
                    <div className="el-dialog__header">
                        <span className="el-dialog__title"></span>
                        <button type="button" onClick={() => handleExit()} aria-label="Close" className="el-dialog__headerbtn">
                            <i className="el-dialog__close el-icon el-icon-close">
                            </i>
                        </button>
                    </div>
                    <div className="el-dialog__body">
                        <div className="header" style={{
                            backgroundImage: `url('${editData.banner}')`
                        }}>
                            <div className="el-dialog__content">
                                <div className="el-dialog__cover">
                                    <img src={editData.img} />
                                </div>
                                <div className="el-dialog__title">{editData.name}</div>
                                <div className="el-favourite el-outline" onClick={() => handleSaveFavourite()}>
                                    <svg data-v-0228dea0="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={`el-dialog__svg ${editData.favourite ? "elActive" : ""}`}><path data-v-0228dea0="" fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>
                                </div>
                                <div className="save-btn" onClick={handleSave}>Save</div>
                            </div>
                        </div>

                        <div className="el-body">
                            <div className={`input-wrap ${pathname === "/Profile/Animelist" ? "" : "manga"}`}>
                                <div className="form status">
                                    <div className="input-title">Status</div>
                                    <div className="el-input-number is-controls-right" >
                                        <input
                                            type="text"
                                            ref={(el) => (inputRefs.current['inputS'] = el)}
                                            placeholder={selectedStatusS === "" ? chujec : statusS.find(item => item.key === selectedStatusS)?.label}
                                            className={`el-input__inner ${toggles.inputS ? 'inputActive' : 'inputNoActive'}`}
                                            style={{
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handleToggle('inputS')}
                                            readOnly
                                            autoComplete="off"
                                        />
                                        <span className="iconContainer">
                                            <motion.span
                                                className="contentIcon"
                                                initial="iconClosed"
                                                style={{
                                                    color: '#589ea7'
                                                }}
                                                exit={'iconClosed'}
                                                animate={toggles.inputS ? "iconOpen" : "iconClosed"}
                                                variants={iconVariants}
                                            >
                                                <i id="arrowDown" className="fa-solid fa-angle-down"></i>
                                            </motion.span>
                                        </span>

                                        <motion.div
                                            className='dropdown'
                                            animate={toggles.inputS ? "open" : "closed"}
                                            initial="closed"
                                            exit="closed"
                                            variants={menuVariants}
                                            ref={(el) => (dropdownRefs.current['inputS'] = el)}
                                        >
                                            <div className="dropdownContent">
                                                <ul>
                                                    <li>
                                                        {statusS.map((item) => (
                                                            <motion.span key={item.key}
                                                                variants={itemVariants} style={{
                                                                    color: `${selectedStatusS === item.key ? '#589ea7' : ""}`
                                                                }} transition={{ opacity: { duration: 0.2 } }}
                                                                onMouseDown={() => handleSelectOption(item, 'inputS')} // Dodanie obsługi kliknięcia
                                                            >
                                                                {item.label}
                                                            </motion.span>
                                                        ))}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="arrowUp" style={{
                                                top: '-17.5px',

                                            }}>
                                                <span className="arrowUpContent" style={{
                                                    color: '#589ea7'
                                                }}>
                                                    <i id="arrowUp" className="fa-solid fa-sort-up"></i>
                                                </span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="form el-score">


                                    <div className="input-title">Score</div>
                                    <div className="el-input-number is-controls-right">
                                        <span className="el-input-number__decrease" onClick={() => handleDecrease('score', 0)}>
                                            <i className="el-icon-arrow-down"></i>
                                        </span>
                                        <span className="el-input-number__increase" onClick={() => handleIncrease('score', 10)}>
                                            <i className="el-icon-arrow-up"></i>
                                        </span>
                                        <div className="el-input">
                                            <input
                                                type="number"
                                                value={editData.score !== '' ? editData.score : ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;

                                                    // Pozwól na pustą wartość (np. usuwanie)
                                                    if (value === '') {
                                                        setEditData(prev => ({ ...prev, score: '' }));
                                                        return;
                                                    }

                                                    let numValue = Number(value);

                                                    if (isNaN(numValue) || numValue < 0) {
                                                        numValue = 0;
                                                    } else if (numValue > 10) {
                                                        numValue = 10;
                                                    }

                                                    setEditData(prev => ({ ...prev, score: numValue }));
                                                }}
                                                autoComplete="off"
                                                max="10"
                                                min="0"
                                                className="el-input__inner"
                                                role="spinbutton"
                                                aria-valuemax="10"
                                                aria-valuemin="0"
                                                aria-valuenow={typeof editData.score === 'number' ? editData.score : 0}
                                                aria-disabled="false"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form progressL">
                                    <div className="input-title">{pathname === "/Profile/Animelist" ? 'Episode Progress' : 'Chapter Progress'}</div>
                                    <div className="el-input-number is-controls-right">
                                        <span className="el-input-number__decrease" onClick={() => handleDecrease('progress', 0)}>
                                            <i className="el-icon-arrow-down"></i>
                                        </span>
                                        <span className="el-input-number__increase" onClick={() => handleIncrease('progress', editData.episodes === 0 ? Infinity : editData.episodes)}>
                                            <i className="el-icon-arrow-up"></i>
                                        </span>
                                        <div className="el-input">
                                            <input type="text" value={`${editData.progress}`}
                                                onChange={(e) => {
                                                    let value = Number(e.target.value);
                                                    const maxLimit = editData.episodes === 0 ? Infinity : editData.episodes;

                                                    if (value > maxLimit) value = maxLimit;
                                                    if (value < 0 || isNaN(value)) value = 0;

                                                    setEditData(prev => ({ ...prev, progress: value }));
                                                }} autoComplete="off" max={'10'} min="0" className="el-input__inner" role="spinbutton" aria-valuemax={'10'} aria-valuemin="0" aria-valuenow="0" aria-disabled="false" />
                                        </div>
                                    </div>
                                </div>





                                <div className="form start">
                                    <div className="input-title">Start Date</div>
                                    <div className="el-date-editor">

                                        <input
                                            type="text"
                                            ref={(el) => (inputRefs.current['inputDate'] = el)}
                                            value={
                                                editData.startDateYear && editData.startDateMonth && editData.startDateDay
                                                    ? `${editData.startDateYear}-${String(editData.startDateMonth).padStart(2, '0')}-${String(editData.startDateDay).padStart(2, '0')}`
                                                    : ""
                                            }
                                            className={`el-input__inner ${toggles.inputDate ? 'inputActive' : 'inputNoActive'}`}

                                            style={{
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handleToggle('inputDate')}
                                            readOnly

                                            autoComplete="off"
                                        />

                                        <span className="el-input__prefix">
                                            <i className="el-input__icon el-icon-date"></i>
                                        </span>

                                        <span className="el-input__suffix">
                                            <span className="el-input__suffix-inner">
                                                <span className="el-input__suffix-inner">
                                                    <svg onClick={() => {
                                                        setDefaultValue(null);
                                                        setEditData(prevData => ({
                                                            ...prevData,
                                                            startDateYear: 0,
                                                            startDateMonth: 0,
                                                            startDateDay: 0,
                                                        }));
                                                    }} data-v-17620a08="" aria-hidden="true" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className={`el-input__icon5 ${defaultValue || (editData.startDateYear && editData.startDateMonth && editData.startDateDay) ? "pierdol" : "sie"}`}><path data-v-17620a08="" fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
                                                </span>
                                            </span>
                                        </span>

                                        <motion.div
                                            className='dropdownDate'
                                            animate={toggles.inputDate ? "open" : "closed"}
                                            initial="closed"
                                            exit="closed"
                                            variants={menuVariants}
                                            ref={(el) => (dropdownRefs.current['inputDate'] = el)}
                                        >
                                            <div className="">

                                                <Calendar aria-label="Date (Uncontrolled)"
                                                    value={defaultValue || (editData.startDateYear && editData.startDateMonth && editData.startDateDay ? parseDate(`${editData.startDateYear}-${String(editData.startDateMonth).padStart(2, '0')}-${String(editData.startDateDay).padStart(2, '0')}`) : null)}
                                                    onChange={(newValue) => {
                                                        setDefaultValue(newValue);

                                                        setEditData(prevData => ({
                                                            ...prevData,
                                                            startDateYear: newValue?.year || 0,
                                                            startDateMonth: newValue?.month || 0,
                                                            startDateDay: newValue?.day || 0,
                                                        }));
                                                    }} />
                                            </div>


                                            <div className="arrowUp" style={{
                                                top: '-10.5px',

                                            }}>
                                                <span className="arrowUpContent" style={{
                                                    color: '#589ea7'
                                                }}>
                                                    <i id="arrowUp" className="fa-solid fa-sort-up"></i>
                                                </span>
                                            </div>
                                        </motion.div>



                                    </div>


                                </div>


                                {pathname === "/Profile/Mangalist" && <><div className="form repeat">
                                    <div className="input-title">Total Rereads</div>
                                    <div className="el-input-number is-controls-right">
                                        <span className="el-input-number__decrease" onClick={() => handleDecrease('repeat', 0)}>
                                            <i className="el-icon-arrow-down"></i>
                                        </span>
                                        <span className="el-input-number__increase" onClick={() => handleIncrease('repeat', Infinity)}>
                                            <i className="el-icon-arrow-up"></i>
                                        </span>
                                        <div className="el-input">
                                            <input type="text" value={editData.repeat} onChange={(e) => {
                                                let value = Number(e.target.value);
                                                if (value < 0 || isNaN(value)) value = 0;
                                                setEditData(prev => ({ ...prev, repeat: value }));
                                            }} autoComplete="off" max="10" min="0" className="el-input__inner" role="spinbutton" aria-valuemax="10" aria-valuemin="0" aria-valuenow="9" aria-disabled="undefined" />
                                        </div>
                                    </div>
                                </div>


                                    <div className="form progressVolumes">
                                        <div className="input-title">Volumes Progress</div>
                                        <div className="el-input-number is-controls-right">
                                            <span className="el-input-number__decrease" onClick={() => handleDecrease('volumes', 0)}>
                                                <i className="el-icon-arrow-down"></i>
                                            </span>
                                            <span className="el-input-number__increase" onClick={() => handleIncrease('volumes', editData.volumesCount === 0 ? Infinity : editData.volumesCount)}>
                                                <i className="el-icon-arrow-up"></i>
                                            </span>
                                            <div className="el-input">
                                                <input type="text" value={`${editData.volumes}`}
                                                    onChange={(e) => {
                                                        let value = Number(e.target.value);
                                                        const maxLimit = editData.volumesCount === 0 ? Infinity : editData.volumesCount;

                                                        if (value > maxLimit) value = maxLimit;
                                                        if (value < 0 || isNaN(value)) value = 0;

                                                        setEditData(prev => ({ ...prev, volumes: value }));
                                                    }} autoComplete="off" max={'10'} min="0" className="el-input__inner" role="spinbutton" aria-valuemax={'10'} aria-valuemin="0" aria-valuenow="0" aria-disabled="false" />
                                            </div>
                                        </div>
                                    </div></>}

                                <div className="form finish">
                                    <div className="input-title">Finish Date</div>
                                    <div className="el-date-editor">

                                        <input
                                            type="text"
                                            ref={(el) => (inputRefs.current['inputDate2'] = el)}
                                            value={
                                                editData.endDateYear && editData.endDateMonth && editData.endDateDay
                                                    ? `${editData.endDateYear}-${String(editData.endDateMonth).padStart(2, '0')}-${String(editData.endDateDay).padStart(2, '0')}`
                                                    : ""
                                            }
                                            className={`el-input__inner ${toggles.inputDate2 ? 'inputActive' : 'inputNoActive'}`}

                                            style={{
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handleToggle('inputDate2')}
                                            readOnly
                                            autoComplete="off"
                                        />

                                        <span className="el-input__prefix">
                                            <i className="el-input__icon el-icon-date"></i>
                                        </span>

                                        <span className="el-input__suffix">
                                            <span className="el-input__suffix-inner">
                                                <svg onClick={() => {
                                                    setDefaultValue2(null);
                                                    setEditData(prevData => ({
                                                        ...prevData,
                                                        endDateYear: 0,
                                                        endDateMonth: 0,
                                                        endDateDay: 0,
                                                    }));
                                                }} data-v-17620a08="" aria-hidden="true" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className={`el-input__icon5 ${defaultValue || (editData.startDateYear && editData.startDateMonth && editData.startDateDay) ? "pierdol" : "sie"}`}><path data-v-17620a08="" fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
                                            </span>
                                        </span>

                                        <motion.div
                                            className='dropdownDate'
                                            animate={toggles.inputDate2 ? "open" : "closed"}
                                            initial="closed"
                                            exit="closed"
                                            variants={menuVariants}
                                            ref={(el) => (dropdownRefs.current['inputDate2'] = el)}
                                        >
                                            <div className="">
                                                <Calendar aria-label="Date (Controlled)"
                                                    value={defaultValue2 || (editData.endDateYear && editData.endDateMonth && editData.endDateDay ? parseDate(`${editData.endDateYear}-${String(editData.endDateMonth).padStart(2, '0')}-${String(editData.endDateDay).padStart(2, '0')}`) : null)}
                                                    onChange={(newValue) => {
                                                        setDefaultValue2(newValue);

                                                        setEditData(prevData => ({
                                                            ...prevData,
                                                            endDateYear: newValue?.year || 0,
                                                            endDateMonth: newValue?.month || 0,
                                                            endDateDay: newValue?.day || 0,
                                                        }));
                                                    }} />
                                            </div>


                                            <div className="arrowUp" style={{
                                                top: '-10.5px',

                                            }}>
                                                <span className="arrowUpContent" style={{
                                                    color: '#589ea7'
                                                }}>
                                                    <i id="arrowUp" className="fa-solid fa-sort-up"></i>
                                                </span>
                                            </div>
                                        </motion.div>



                                    </div>


                                </div>



                                {pathname === "/Profile/Animelist" && <div className="form repeat">
                                    <div className="input-title">Total Rewatches</div>
                                    <div className="el-input-number is-controls-right">
                                        <span className="el-input-number__decrease" onClick={() => handleDecrease('repeat', 0)}>
                                            <i className="el-icon-arrow-down"></i>
                                        </span>
                                        <span className="el-input-number__increase" onClick={() => handleIncrease('repeat', Infinity)}>
                                            <i className="el-icon-arrow-up"></i>
                                        </span>
                                        <div className="el-input">
                                            <input type="text" value={editData.repeat} onChange={(e) => {
                                                let value = Number(e.target.value);
                                                if (value < 0 || isNaN(value)) value = 0;
                                                setEditData(prev => ({ ...prev, repeat: value }));
                                            }} autoComplete="off" max="10" min="0" className="el-input__inner" role="spinbutton" aria-valuemax="10" aria-valuemin="0" aria-valuenow="9" aria-disabled="undefined" />
                                        </div>
                                    </div>
                                </div>}

                                <div className="form notes">
                                    <div className="input-title">
                                        Notes
                                    </div>
                                    <div className="el-textarea">
                                        <textarea autoComplete="off" value={editData.notes}
                                            onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))} className="el-textarea__inner" style={{ minHeight: "35px", height: "35px" }}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="checkbox-wrap">
                                <div className="delete-btn" onClick={handleDelete}>Delete</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div >
            <div className="contentContainer">
                <div className="all">
                    <div className="contentWhole">
                        <div className="content">
                            <input type="search" value={value} onChange={e => setValue(e.target.value)} autoComplete="off" name="search" className="search" placeholder="filter" />

                            <i id="searchClear" onClick={clearInput} className="fa fa-times-circle"></i>
                            <div className="conSearch">
                                <svg viewBox="0 0 24 24" fill="none" className="searchList" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <div className={`contentFilter ${toggles.button ? 'buttonActive' : 'buttonNoActive'}`} onClick={() => handleToggle('button')}
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

                        <div className={`listContainer ${toggles.button ? 'buttonActive' : 'buttonNoActive'}`}>
                            <div className="group">
                                <div className="list">
                                    <p>Lists</p>
                                </div>

                                {filter.map((item, index) => (
                                    <span key={index} onClick={() => handleToggleOption(item)} className={`listOption ${isToggleOption === item ? "listOptionActive" : "linkOptionNoActive"}`}>
                                        {item} <div className="filterCount">{index === 0 && currentEntriesCount + completedEntriesCount + droppedEntriesCount + planningEntriesCount + repeatingEntriesCount + pausedEntriesCount} {index === 1 && currentEntriesCount} {index === 2 && completedEntriesCount} {index === 3 && droppedEntriesCount} {index === 4 && planningEntriesCount} {index === 5 && pausedEntriesCount} {index === 6 && repeatingEntriesCount}</div>
                                    </span>
                                ))}
                            </div>

                            <div className="group">
                                <div className="list">
                                    <p>Filters</p>
                                </div>

                                <div className="filterOption">
                                    <div className="inputContainer">
                                        <div className="contentFilterInput" >
                                            <input
                                                type="text"
                                                ref={(el) => (inputRefs.current['input1'] = el)}
                                                placeholder={selectedFormat === "Format" ? "Format" : format.find(item => item.key === selectedFormat)?.label}
                                                className={`filterInput ${toggles.input1 ? 'inputActive' : 'inputNoActive'}`}
                                                onClick={() => handleToggle('input1')}
                                                readOnly
                                                autoComplete="off"
                                            />
                                            <span className="iconContainer">
                                                <motion.span
                                                    className="contentIcon"
                                                    initial="iconClosed"
                                                    exit={'iconClosed'}
                                                    animate={toggles.input1 ? "iconOpen" : "iconClosed"}
                                                    variants={iconVariants}
                                                >
                                                    <i id="arrowDown" className="fa-solid fa-angle-down"></i>
                                                </motion.span>
                                            </span>

                                            <motion.div
                                                className='dropdown'
                                                animate={toggles.input1 ? "open" : "closed"}
                                                initial="closed"
                                                exit="closed"
                                                variants={menuVariants}
                                                ref={(el) => (dropdownRefs.current['input1'] = el)}
                                            >
                                                <div className="dropdownContent">
                                                    <ul>
                                                        <li>
                                                            {format.map((item) => (
                                                                <motion.span key={item.key}
                                                                    variants={itemVariants} style={{
                                                                        backgroundColor: `${selectedFormat === item.key ? '#134e4a' : ""}`
                                                                    }} transition={{ opacity: { duration: 0.2 } }}
                                                                    onMouseDown={() => handleSelectOption(item, 'input1')} // Dodanie obsługi kliknięcia
                                                                >
                                                                    {item.label}
                                                                </motion.span>
                                                            ))}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="arrowUp">
                                                    <span className="arrowUpContent">
                                                        <i id="arrowUp" className="fa-solid fa-sort-up"></i>
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="contentFilterInput">
                                            <input ref={(el) => (inputRefs.current['input2'] = el)} type="text" placeholder={selectedStatus === "Status" ? "Status" : statusList2.find(item => item.key === selectedStatus)?.label} className={`filterInput`} onClick={() => handleToggle('input2')} readOnly="readOnly" autoComplete="off" />
                                            <span className="iconContainer">
                                                <motion.span
                                                    className="contentIcon"
                                                    initial="iconClosed"
                                                    exit={'iconClosed'}
                                                    animate={toggles.input2 ? "iconOpen" : "iconClosed"}
                                                    variants={iconVariants}
                                                >
                                                    <i id="arrowDown" className="fa-solid fa-angle-down"></i>
                                                </motion.span>
                                            </span>

                                            <motion.div
                                                className='dropdown'
                                                animate={toggles.input2 ? "open" : "closed"}
                                                initial="closed"
                                                exit="closed"
                                                variants={menuVariants}
                                                ref={(el) => (dropdownRefs.current['input2'] = el)}
                                            >
                                                <div className="dropdownContent">
                                                    <ul>
                                                        <li>
                                                            {status.map((item) => (
                                                                <motion.span key={item.key}
                                                                    variants={itemVariants} transition={{ opacity: { duration: 0.2 } }}
                                                                    style={{
                                                                        backgroundColor: `${selectedStatus === item.key ? '#134e4a' : ""}`
                                                                    }}
                                                                    onMouseDown={() => handleSelectOption(item, 'input2')}
                                                                >
                                                                    {item.label}
                                                                </motion.span>
                                                            ))}


                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="arrowUp">
                                                    <span className="arrowUpContent">
                                                        <i id="arrowUp" className="fa-solid fa-sort-up"></i>
                                                    </span>
                                                </div>
                                            </motion.div>

                                        </div>

                                        <div className="contentFilterInput">
                                            <input
                                                ref={(el) => (inputRefs.current['input3'] = el)}
                                                type="text"
                                                placeholder={selectedGenre.length === 0 ? "Genres" : `${selectedGenre.join(', ')}`}
                                                className={`filterInput`}
                                                onMouseDown={() => handleToggle('input3')}
                                                readOnly="readOnly"
                                                autoComplete="off"
                                            />
                                            <span className="iconContainer">
                                                <motion.span
                                                    className="contentIcon"
                                                    initial="iconClosed"
                                                    exit={'iconClosed'}
                                                    animate={toggles.input3 ? "iconOpen" : "iconClosed"}
                                                    variants={iconVariants}
                                                >
                                                    <i id="arrowDown" className="fa-solid fa-angle-down"></i>
                                                </motion.span>
                                            </span>

                                            <motion.div
                                                className='dropdown'
                                                animate={toggles.input3 ? "open" : "closed"}
                                                initial="closed"
                                                exit="closed"
                                                variants={menuVariants}
                                                ref={(el) => (dropdownRefs.current['input3'] = el)}
                                            >
                                                <div className="dropdownContent">
                                                    <ul>
                                                        <li>
                                                            {genresList.map((item) => (
                                                                <motion.span
                                                                    key={item.key}
                                                                    variants={itemVariants}
                                                                    transition={{ opacity: { duration: 0.2 } }}
                                                                    style={{
                                                                        backgroundColor: `${selectedGenre.includes(item.key) ? '#134e4a' : ""}`
                                                                    }}
                                                                    onMouseDown={() => handleSelectOption(item, 'input3')}
                                                                >
                                                                    {item.key}
                                                                </motion.span>
                                                            ))}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="arrowUp">
                                                    <span className="arrowUpContent">
                                                        <i id="arrowUp" className="fa-solid fa-sort-up"></i>
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="contentFilterInput" tabIndex='-1'>
                                            <input
                                                ref={(el) => (inputRefs.current['input4'] = el)}
                                                type="text" placeholder={selectedCountry === "Country" ? "Country" : countryList.find(item => item.key === selectedCountry)?.label} className={`filterInput`} onMouseDown={() => handleToggle('input4')} readOnly="readOnly" autoComplete="off" />
                                            <span className="iconContainer">
                                                <motion.span
                                                    className="contentIcon"
                                                    initial="iconClosed"
                                                    exit={'iconClosed'}
                                                    animate={toggles.input4 ? "iconOpen" : "iconClosed"}

                                                    variants={iconVariants}
                                                >
                                                    <i id="arrowDown" className="fa-solid fa-angle-down"></i>
                                                </motion.span>
                                            </span>

                                            <motion.div
                                                className='dropdown'
                                                animate={toggles.input4 ? "open" : "closed"}
                                                initial="closed"
                                                exit="closed"
                                                variants={menuVariants}
                                                tabIndex={-1}
                                                ref={(el) => (dropdownRefs.current['input4'] = el)}
                                            >
                                                <div className="dropdownContent" >
                                                    <ul>
                                                        <li>
                                                            {countryList.map((item) => (
                                                                <motion.span key={item.key}
                                                                    variants={itemVariants} transition={{ opacity: { duration: 0.2 } }}
                                                                    style={{
                                                                        backgroundColor: `${selectedCountry.includes(item.key) ? '#134e4a' : ""}`

                                                                    }}
                                                                    onMouseDown={() => handleSelectOption(item, 'input4')}
                                                                >
                                                                    {item.label}
                                                                </motion.span>
                                                            ))}


                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="arrowUp">
                                                    <span className="arrowUpContent">
                                                        <i id="arrowUp" className="fa-solid fa-sort-up"></i>
                                                    </span>
                                                </div>
                                            </motion.div>

                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <div className="list">
                                    <p>Sort</p>
                                </div>

                                <div className="filterOption">
                                    <div className="inputContainer">
                                        <div className="contentFilterInput">
                                            <input ref={(el) => inputRefs.current['input5'] = el} type="text"
                                                placeholder={selectedSort === "Sort" ? "Sort" : sortList.find(item => item.key === selectedSort)?.label}
                                                onMouseDown={() => handleToggle('input5')}
                                                className={`filterInput`} readOnly="readOnly" autoComplete="off" />
                                            <span className="iconContainer">
                                                <motion.span
                                                    className="contentIcon"
                                                    initial="iconClosed"
                                                    exit={'iconClosed'}
                                                    animate={toggles.input5 ? 'iconOpen' : 'iconClosed'}
                                                    variants={iconVariants}
                                                >
                                                    <i id="arrowDown" className="fa-solid fa-angle-down"></i>
                                                </motion.span>
                                            </span>

                                            <motion.div
                                                className='dropdown'
                                                animate={toggles.input5 ? 'open' : 'closed'}
                                                initial="closed"
                                                exit="closed"
                                                ref={(el) => dropdownRefs.current['input5'] = el}
                                                variants={menuVariants}
                                            >
                                                <div className="dropdownContent">
                                                    <ul>
                                                        <li>
                                                            {sortList.map((item) => (
                                                                <motion.span key={item.key}
                                                                    variants={itemVariants} transition={{ opacity: { duration: 0.2 } }}
                                                                    style={{
                                                                        backgroundColor: `${selectedSort.includes(item.key) ? '#134e4a' : ""}`

                                                                    }}
                                                                    onMouseDown={() => handleSelectOption(item, 'input5')}
                                                                >
                                                                    {item.label}
                                                                </motion.span>
                                                            ))}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="arrowUp">
                                                    <span className="arrowUpContent">
                                                        <i id="arrowUp" className="fa-solid fa-sort-up"></i>
                                                    </span>
                                                </div>
                                            </motion.div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>





                    </div>

                    <div className="prawa">
                        <div className="section-name">
                            <div className="themeContainer">
                                <div className="theme-switch">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                        width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                                        preserveAspectRatio="xMidYMid meet" className={`themeIcon ${hoveredTheme === 1 ? 'themeActive' : "themeNoActive"}`} onClick={() => handleClick(1)}>

                                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                            fill="currentColor" stroke="none">
                                            <path d="M78 4489 c-23 -12 -46 -35 -58 -59 -19 -37 -20 -58 -20 -470 0 -412
1 -433 20 -470 13 -26 34 -47 60 -60 37 -19 58 -20 470 -20 412 0 433 1 470
20 26 13 47 34 60 60 19 37 20 58 20 470 0 412 -1 433 -20 470 -13 26 -34 47
-60 60 -38 19 -58 20 -472 20 -411 -1 -435 -2 -470 -21z"/>
                                            <path d="M1478 4489 c-23 -12 -46 -35 -58 -59 -19 -37 -20 -58 -20 -470 0
-412 1 -433 20 -470 13 -26 34 -47 60 -60 39 -20 55 -20 1780 -20 1725 0 1741
0 1780 20 26 13 47 34 60 60 19 37 20 58 20 470 0 412 -1 433 -20 470 -13 26
-34 47 -60 60 -39 20 -55 20 -1782 20 -1716 -1 -1744 -1 -1780 -21z"/>
                                            <path d="M78 3089 c-23 -12 -46 -35 -58 -59 -19 -37 -20 -58 -20 -470 0 -412
1 -433 20 -470 13 -26 34 -47 60 -60 37 -19 58 -20 470 -20 412 0 433 1 470
20 26 13 47 34 60 60 19 37 20 58 20 470 0 412 -1 433 -20 470 -13 26 -34 47
-60 60 -38 19 -58 20 -472 20 -411 -1 -435 -2 -470 -21z"/>
                                            <path d="M1478 3089 c-23 -12 -46 -35 -58 -59 -19 -37 -20 -58 -20 -470 0
-412 1 -433 20 -470 13 -26 34 -47 60 -60 39 -20 55 -20 1780 -20 1725 0 1741
0 1780 20 26 13 47 34 60 60 19 37 20 58 20 470 0 412 -1 433 -20 470 -13 26
-34 47 -60 60 -39 20 -55 20 -1782 20 -1716 -1 -1744 -1 -1780 -21z"/>
                                            <path d="M78 1689 c-23 -12 -46 -35 -58 -59 -19 -37 -20 -58 -20 -470 0 -412
1 -433 20 -470 13 -26 34 -47 60 -60 37 -19 58 -20 470 -20 412 0 433 1 470
20 26 13 47 34 60 60 19 37 20 58 20 470 0 412 -1 433 -20 470 -13 26 -34 47
-60 60 -38 19 -58 20 -472 20 -411 -1 -435 -2 -470 -21z"/>
                                            <path d="M1478 1689 c-23 -12 -46 -35 -58 -59 -19 -37 -20 -58 -20 -470 0
-412 1 -433 20 -470 13 -26 34 -47 60 -60 39 -20 55 -20 1780 -20 1725 0 1741
0 1780 20 26 13 47 34 60 60 19 37 20 58 20 470 0 412 -1 433 -20 470 -13 26
-34 47 -60 60 -39 20 -55 20 -1782 20 -1716 -1 -1744 -1 -1780 -21z"/>
                                        </g>
                                    </svg>


                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                        width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                                        preserveAspectRatio="xMidYMid meet" className={`themeIcon ${hoveredTheme === 2 ? 'themeActive' : 'themeNoActive'}`} onClick={() => handleClick(2)}>

                                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                            fill="currentColor" stroke="none">
                                            <path d="M272 4480 c-102 -22 -193 -96 -241 -199 -22 -47 -26 -69 -26 -141 1
-72 5 -94 28 -142 62 -128 203 -208 341 -194 293 30 415 382 204 588 -75 73
-201 110 -306 88z"/>
                                            <path d="M1360 4405 c-101 -32 -170 -129 -170 -241 0 -34 7 -78 15 -98 23 -55
79 -111 135 -135 l49 -21 1778 2 c1678 3 1780 4 1810 21 90 49 138 130 138
232 -1 101 -48 179 -140 228 l-40 22 -1765 2 c-1490 1 -1772 0 -1810 -12z"/>
                                            <path d="M250 2891 c-93 -29 -177 -101 -219 -190 -38 -81 -38 -201 0 -282 56
-119 161 -190 294 -197 104 -5 173 19 248 88 75 69 110 147 110 250 0 62 -6
88 -28 139 -35 78 -113 151 -190 180 -57 22 -164 27 -215 12z"/>
                                            <path d="M1393 2810 c-123 -25 -203 -122 -203 -250 0 -106 53 -189 150 -234
l45 -21 1770 0 c1650 0 1772 1 1806 17 54 25 96 64 127 117 23 39 27 57 27
121 0 64 -4 82 -27 121 -31 53 -73 92 -127 117 -34 16 -156 17 -1781 19 -960
0 -1764 -3 -1787 -7z"/>
                                            <path d="M233 1300 c-80 -26 -161 -99 -200 -178 -23 -48 -27 -70 -28 -142 0
-77 3 -92 33 -152 73 -148 229 -223 384 -183 160 40 260 168 260 330 1 235
-225 398 -449 325z"/>
                                            <path d="M1335 1187 c-93 -44 -145 -126 -145 -231 0 -76 34 -151 88 -196 77
-64 -36 -60 1897 -58 l1760 3 40 22 c92 49 139 127 140 228 0 102 -48 183
-138 232 -30 17 -132 18 -1812 20 l-1780 3 -50 -23z"/>
                                        </g>
                                    </svg>
                                    <svg data-v-0567dd85="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="th-large" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={`themeIcon ${hoveredTheme === 3 ? 'themeActive' : 'themeNoActive'}`} onClick={() => handleClick(3)}><path data-v-0567dd85="" fill="currentColor" d="M296 32h192c13.255 0 24 10.745 24 24v160c0 13.255-10.745 24-24 24H296c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24zm-80 0H24C10.745 32 0 42.745 0 56v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24zM0 296v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm296 184h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H296c-13.255 0-24 10.745-24 24v160c0 13.255 10.745 24 24 24z"></path></svg>
                                </div>
                            </div>

                            <h3>
                                {
                                    statusText
                                }




                            </h3>

                        </div>


                        {((isToggleOption === "All" || (pathname === "/Profile/Animelist" ? isToggleOption === "Watching" : isToggleOption === "Reading")) && statusCount["CURRENT"] > 0) && (<div className={`section-list ${hoveredTheme === 1 ? '' : hoveredTheme === 2 ? 'theme-one' : hoveredTheme === 3 ? 'theme-two' : ""}`}>
                            <div className={` ${pathname === '/Profile/Mangalist' ? 'list-headManga' : "list-head"}`}>
                                {options.map((item, index) => (
                                    <div key={index} className="listTitle">
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className="list">


                                {["table1"].map((tableKey) => {

                                    const tableStatusForThisTable = tableStatus[tableKey];

                                    return (
                                        <>
                                            {
                                                sortedEntries.filter((entry) => entry.status === tableStatusForThisTable).map((item, index) => {
                                                    const media = item.media;
                                                    const formattedType = filteredFormats(item);

                                                    return (
                                                        <div key={index} className="entry row">


                                                            <div className="cover">
                                                                <div className="edit" onClick={() => handleEdit('edit', item)}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="editSvg"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>
                                                                </div>

                                                                <Image src={media.coverImage?.large} width={"50"} height={"50"} alt="cosik" unoptimized />
                                                            </div>


                                                            <div className="title">
                                                                <Link href={`/${pathname === "/Profile/Animelist" ? "anime" : "manga"}/${item.mediaId}`}>{media.title?.english === null ? media.title?.romaji : media.title?.english}</Link>
                                                                {item.notes && <span className="notes2" label={item.notes}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                                </span>}

                                                                {item.repeat !== 0 && <span className="repeat" label={item.repeat}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                                </span>}
                                                            </div>

                                                            <div className="stats">
                                                                {item?.score !== 0 && <div className="score1">{item?.score} </div>}
                                                                <div className="listProgress1">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                    cursor: 'pointer'
                                                                }} className="scoreProgress">+</span></div>
                                                            </div>
                                                            <div className="score">{item?.score || ""}</div>
                                                            <div className="listProgress">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                cursor: 'pointer'
                                                            }} className="scoreProgress">+</span></div>
                                                            {pathname === "/Profile/Mangalist" && <div className="listProgress volumesProgress">{item?.progressVolumes}{media.volumes !== null && `/${media.volumes}`}</div>}
                                                            <div className="type">{formattedType}</div>

                                                            {item.notes && <span className="notesAbsolute" label={item.notes}>
                                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                            </span>}

                                                            {item.repeat !== 0 && <span className="repeatAbsolute" label={item.repeat}>
                                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                            </span>}
                                                            {(item?.status === "CURRENT" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null) && media.status !== "FINISHED") && <span className="release-status"></span>}
                                                            {(item?.status === "DROPPED" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status3"></span>}
                                                            {(item?.status === "PLANNING" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status2"></span>}
                                                        </div >
                                                    );
                                                })
                                            }
                                        </>
                                    );
                                })}


                            </div>
                        </div>
                        )}


                        {((isToggleOption === "All") && statusCount["REPEATING"] > 0) && <div className="section-name"><h3>{pathname === "/Profile/Animelist" ? "Rewatching" : "Rereading"}</h3></div>}
                        {((isToggleOption === "All" || (pathname === "/Profile/Animelist" ? isToggleOption === "Rewatching" : isToggleOption === "Rereading")) && statusCount["REPEATING"] > 0) && <>



                            <div className={`section-list ${hoveredTheme === 1 ? '' : hoveredTheme === 2 ? 'theme-one' : hoveredTheme === 3 ? 'theme-two' : ""}`}>
                                <div className={` ${pathname === '/Profile/Mangalist' ? 'list-headManga' : "list-head"}`}>
                                    {options.map((item, index) => (
                                        <div key={index} className="listTitle">
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <div className="list">


                                    {["table6"].map((tableKey) => {

                                        const tableStatusForThisTable = tableStatus[tableKey];

                                        return (
                                            <>
                                                {
                                                    sortedEntries.filter((entry) => entry.status === tableStatusForThisTable).map((item, index) => {
                                                        const media = item.media;
                                                        const formattedType = filteredFormats(item);

                                                        return (
                                                            <div key={index} className="entry row">


                                                                <div className="cover">
                                                                    <div className="edit" onClick={() => handleEdit('edit', item)}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="editSvg"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>
                                                                    </div>

                                                                    <Image src={media.coverImage?.large} width={"50"} height={"50"} alt="cosik" unoptimized />
                                                                </div>


                                                                <div className="title">
                                                                    <Link href={`/${pathname === "/Profile/Animelist" ? "anime" : "manga"}/${item.mediaId}`}>{media.title?.english === null ? media.title?.romaji : media.title?.english}</Link>
                                                                    {item.notes && <span className="notes2" label={item.notes}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                                    </span>}

                                                                    {item.repeat !== 0 && <span className="repeat" label={item.repeat}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                                    </span>}
                                                                </div>

                                                                <div className="stats">
                                                                    {item?.score !== 0 && <div className="score1">{item?.score} </div>}
                                                                    <div className="listProgress1">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                        cursor: 'pointer'
                                                                    }} className="scoreProgress">+</span></div>
                                                                </div>
                                                                <div className="score">{item?.score || ""}</div>
                                                                <div className="listProgress">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                    cursor: 'pointer'
                                                                }} className="scoreProgress">+</span></div>
                                                                {pathname === "/Profile/Mangalist" && <div className="listProgress">{item?.progressVolumes}{media.volumes !== null && `/${media.volumes}`}</div>}
                                                                <div className="type">{formattedType}</div>

                                                                {item.notes && <span className="notesAbsolute" label={item.notes}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                                </span>}

                                                                {item.repeat !== 0 && <span className="repeatAbsolute" label={item.repeat}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                                </span>}
                                                                {(item?.status === "CURRENT" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null) && media.status !== "FINISHED") && <span className="release-status"></span>}
                                                                {(item?.status === "DROPPED" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status3"></span>}
                                                                {(item?.status === "PLANNING" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status2"></span>}
                                                            </div >
                                                        );
                                                    })
                                                }
                                            </>
                                        );
                                    })}



                                </div>
                            </div></>}




                        {((isToggleOption === "All") && statusCount["COMPLETED"] > 0) && <div className="section-name"><h3>Completed</h3></div>}
                        {((isToggleOption === "All" || isToggleOption === "Completed") && statusCount["COMPLETED"] > 0) && <>



                            <div className={`section-list ${hoveredTheme === 1 ? '' : hoveredTheme === 2 ? 'theme-one' : hoveredTheme === 3 ? 'theme-two' : ""}`}>
                                <div className={` ${pathname === '/Profile/Mangalist' ? 'list-headManga' : "list-head"}`}>
                                    {options.map((item, index) => (
                                        <div key={index} className="listTitle">
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <div className="list">


                                    {["table2"].map((tableKey) => {

                                        const tableStatusForThisTable = tableStatus[tableKey];

                                        return (
                                            <>
                                                {
                                                    sortedEntries.filter((entry) => entry.status === tableStatusForThisTable).map((item, index) => {
                                                        const media = item.media;
                                                        const formattedType = filteredFormats(item);

                                                        return (
                                                            <div key={index} className="entry row">


                                                                <div className="cover">
                                                                    <div className="edit" onClick={() => handleEdit('edit', item)}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="editSvg"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>
                                                                    </div>

                                                                    <Image src={media.coverImage?.large} width={"50"} height={"50"} alt="cosik" unoptimized />
                                                                </div>


                                                                <div className="title">
                                                                    <Link href={`/${pathname === "/Profile/Animelist" ? "anime" : "manga"}/${item.mediaId}`}>{media.title?.english === null ? media.title?.romaji : media.title?.english}</Link>
                                                                    {item.notes && <span className="notes2" label={item.notes}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                                    </span>}

                                                                    {item.repeat !== 0 && <span className="repeat" label={item.repeat}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                                    </span>}
                                                                </div>

                                                                <div className="stats">
                                                                    {item?.score !== 0 && <div className="score1">{item?.score} </div>}
                                                                    <div className="listProgress1">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                        cursor: 'pointer'
                                                                    }} className="scoreProgress">+</span></div>
                                                                </div>
                                                                <div className="score">{item?.score || ""}</div>
                                                                <div className="listProgress">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                    cursor: 'pointer'
                                                                }} className="scoreProgress">+</span></div>
                                                                {pathname === "/Profile/Mangalist" && <div className="listProgress">{item?.progressVolumes}{media.volumes !== null && `/${media.volumes}`}</div>}
                                                                <div className="type">{formattedType}</div>

                                                                {item.notes && <span className="notesAbsolute" label={item.notes}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                                </span>}

                                                                {item.repeat !== 0 && <span className="repeatAbsolute" label={item.repeat}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                                </span>}
                                                                {(item?.status === "CURRENT" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null) && media.status !== "FINISHED") && <span className="release-status"></span>}
                                                                {(item?.status === "DROPPED" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status3"></span>}
                                                                {(item?.status === "PLANNING" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status2"></span>}
                                                            </div >
                                                        );
                                                    })
                                                }
                                            </>
                                        );
                                    })}



                                </div>
                            </div></>}



                        {((isToggleOption === "All") && statusCount["PAUSED"] > 0) && <div className="section-name"><h3>Paused</h3></div>}
                        {((isToggleOption === "All" || isToggleOption === "Paused") && statusCount["PAUSED"] > 0) && <>



                            <div className={`section-list ${hoveredTheme === 1 ? '' : hoveredTheme === 2 ? 'theme-one' : hoveredTheme === 3 ? 'theme-two' : ""}`}>
                                <div className={` ${pathname === '/Profile/Mangalist' ? 'list-headManga' : "list-head"}`}>
                                    {options.map((item, index) => (
                                        <div key={index} className="listTitle">
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <div className="list">


                                    {["table5"].map((tableKey) => {

                                        const tableStatusForThisTable = tableStatus[tableKey];

                                        return (
                                            <>
                                                {
                                                    sortedEntries.filter((entry) => entry.status === tableStatusForThisTable).map((item, index) => {
                                                        const media = item.media;
                                                        const formattedType = filteredFormats(item);

                                                        return (
                                                            <div key={index} className="entry row">


                                                                <div className="cover">
                                                                    <div className="edit" onClick={() => handleEdit('edit', item)}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="editSvg"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>
                                                                    </div>

                                                                    <Image src={media.coverImage?.large} width={"50"} height={"50"} alt="cosik" unoptimized />
                                                                </div>


                                                                <div className="title">
                                                                    <Link href={`/${pathname === "/Profile/Animelist" ? "anime" : "manga"}/${item.mediaId}`}>{media.title?.english === null ? media.title?.romaji : media.title?.english}</Link>
                                                                    {item.notes && <span className="notes2" label={item.notes}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                                    </span>}

                                                                    {item.repeat !== 0 && <span className="repeat" label={item.repeat}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                                    </span>}
                                                                </div>

                                                                <div className="stats">
                                                                    {item?.score !== 0 && <div className="score1">{item?.score} </div>}
                                                                    <div className="listProgress1">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                        cursor: 'pointer'
                                                                    }} className="scoreProgress">+</span></div>
                                                                </div>
                                                                <div className="score">{item?.score || ""}</div>
                                                                <div className="listProgress">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                    cursor: 'pointer'
                                                                }} className="scoreProgress">+</span></div>
                                                                {pathname === "/Profile/Mangalist" && <div className="listProgress">{item?.progressVolumes}{media.volumes !== null && `/${media.volumes}`}</div>}
                                                                <div className="type">{formattedType}</div>

                                                                {item.notes && <span className="notesAbsolute" label={item.notes}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                                </span>}

                                                                {item.repeat !== 0 && <span className="repeatAbsolute" label={item.repeat}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                                </span>}
                                                                {(item?.status === "CURRENT" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null) && media.status !== "FINISHED") && <span className="release-status"></span>}
                                                                {(item?.status === "DROPPED" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status3"></span>}
                                                                {(item?.status === "PLANNING" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status2"></span>}
                                                            </div >
                                                        );
                                                    })
                                                }
                                            </>
                                        );
                                    })}



                                </div>
                            </div></>}

                        {(isToggleOption === "All" && statusCount["DROPPED"] > 0) && <div className="section-name"><h3>Dropped</h3></div>}
                        {((isToggleOption === "All" || isToggleOption === "Dropped") && statusCount["DROPPED"] > 0) && <>

                            <div className={`section-list ${hoveredTheme === 1 ? '' : hoveredTheme === 2 ? 'theme-one' : hoveredTheme === 3 ? 'theme-two' : ""}`}>
                                <div className={` ${pathname === '/Profile/Mangalist' ? 'list-headManga' : "list-head"}`}>
                                    {options.map((item, index) => (
                                        <div key={index} className="listTitle">
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <div className="list">
                                    {['table3'].map((tableKey) => {

                                        const tableStatusForThisTable = tableStatus[tableKey];

                                        return (
                                            <>
                                                {
                                                    sortedEntries.filter((entry) => entry.status === tableStatusForThisTable).map((item, index) => {
                                                        const media = item.media;
                                                        const formattedType = filteredFormats(item);

                                                        return (
                                                            <div key={index} className="entry row">


                                                                <div className="cover">
                                                                    <div className="edit" onClick={() => handleEdit('edit', item)}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="editSvg"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>
                                                                    </div>

                                                                    <Image src={media.coverImage?.large} width={"50"} height={"50"} alt="cosik" unoptimized />
                                                                </div>


                                                                <div className="title">
                                                                    <Link href={`/${pathname === "/Profile/Animelist" ? "anime" : "manga"}/${item.mediaId}`}>{media.title?.english === null ? media.title?.romaji : media.title?.english}</Link>
                                                                    {item.notes && <span className="notes2" label={item.notes}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                                    </span>}

                                                                    {item.repeat !== 0 && <span className="repeat" label={item.repeat}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                                    </span>}
                                                                </div>

                                                                <div className="stats">
                                                                    {item?.score !== 0 && <div className="score1">{item?.score} </div>}
                                                                    <div className="listProgress1">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                        cursor: 'pointer'
                                                                    }} className="scoreProgress">+</span></div>
                                                                </div>
                                                                <div className="score">{item?.score || ""}</div>
                                                                <div className="listProgress">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                    cursor: 'pointer'
                                                                }} className="scoreProgress">+</span></div>
                                                                {pathname === "/Profile/Mangalist" && <div className="listProgress">{item?.progressVolumes}{media.volumes !== null && `/${media.volumes}`}</div>}
                                                                <div className="type">{formattedType}</div>

                                                                {item.notes && <span className="notesAbsolute" label={item.notes}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                                </span>}

                                                                {item.repeat !== 0 && <span className="repeatAbsolute" label={item.repeat}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                                </span>}
                                                                {(item?.status === "CURRENT" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null) && media.status !== "FINISHED") && <span className="release-status"></span>}
                                                                {(item?.status === "DROPPED" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status3"></span>}
                                                                {(item?.status === "PLANNING" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status2"></span>}
                                                            </div >
                                                        );
                                                    })
                                                }
                                            </>
                                        );
                                    })}




                                </div>
                            </div></>}


                        {(isToggleOption === "All" && statusCount["PLANNING"] > 0) && <div className="section-name"><h3>Planning</h3></div>}
                        {((isToggleOption === "All" || isToggleOption === "Planning") && statusCount["PLANNING"] > 0) && <>

                            <div className={`section-list ${hoveredTheme === 1 ? '' : hoveredTheme === 2 ? 'theme-one' : hoveredTheme === 3 ? 'theme-two' : ""}`}>
                                <div className={` ${pathname === '/Profile/Mangalist' ? 'list-headManga' : "list-head"}`}>
                                    {options.map((item, index) => (
                                        <div key={index} className="listTitle">
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <div className="list">
                                    {["table4"].map((tableKey) => {

                                        const tableStatusForThisTable = tableStatus[tableKey];

                                        return (
                                            <>
                                                {
                                                    sortedEntries.filter((entry) => entry.status === tableStatusForThisTable).map((item, index) => {
                                                        const media = item.media;
                                                        const formattedType = filteredFormats(item);

                                                        return (
                                                            <div key={index} className="entry row">


                                                                <div className="cover">
                                                                    <div className="edit" onClick={() => handleEdit('edit', item)}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="editSvg"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>
                                                                    </div>

                                                                    <Image src={media.coverImage?.large} width={"50"} height={"50"} alt="cosik" unoptimized />
                                                                </div>


                                                                <div className="title">
                                                                    <Link href={`/${pathname === "/Profile/Animelist" ? "anime" : "manga"}/${item.mediaId}`}>{media.title?.english === null ? media.title?.romaji : media.title?.english}</Link>
                                                                    {item.notes && <span className="notes2" label={item.notes}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                                    </span>}

                                                                    {item.repeat !== 0 && <span className="repeat" label={item.repeat}>
                                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                                    </span>}
                                                                </div>

                                                                <div className="stats">
                                                                    {item?.score !== 0 && <div className="score1">{item?.score} </div>}
                                                                    <div className="listProgress1">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                        cursor: 'pointer'
                                                                    }} className="scoreProgress">+</span></div>
                                                                </div>
                                                                <div className="score">{item?.score || ""}</div>
                                                                <div className="listProgress">{item?.progress}{(media.episodes !== null || media.chapters !== null) && `/${pathname === "/Profile/Animelist" ? media.episodes : media.chapters}`} <span onClick={() => handleScore(item)} style={{
                                                                    cursor: 'pointer'
                                                                }} className="scoreProgress">+</span></div>
                                                                {pathname === "/Profile/Mangalist" && <div className="listProgress">{item?.progressVolumes}{media.volumes !== null && `/${media.volumes}`}</div>}
                                                                <div className="type">{formattedType}</div>

                                                                {item.notes && <span className="notesAbsolute" label={item.notes}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="noteSvg"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
                                                                </span>}

                                                                {item.repeat !== 0 && <span className="repeatAbsolute" label={item.repeat}>
                                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="noteSvg"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>
                                                                </span>}
                                                                {(item?.status === "CURRENT" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null) && media.status !== "FINISHED") && <span className="release-status"></span>}
                                                                {(item?.status === "DROPPED" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status3"></span>}
                                                                {(item?.status === "PLANNING" && (pathname === "/Profile/Animelist" ? media.episodes === null : media.chapters === null)) && <span className="release-status release-status2"></span>}
                                                            </div >
                                                        );
                                                    })
                                                }
                                            </>
                                        );
                                    })}



                                </div>
                            </div></>}


                    </div>
                </div >
            </div >


        </>
    );
}
