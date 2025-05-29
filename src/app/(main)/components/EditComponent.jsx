"use client"
import { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import { usePathname } from "next/navigation";
import { useUserContext } from "./userListWrapper"
import { useUser } from "@/src/app/(main)/components/userInfoWrapper";
import { gql, useMutation } from "@apollo/client";
import { Calendar } from "@heroui/react";
import { parseDate } from '@internationalized/date';
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





export default function EditComponent({ editData, isEditOpen, setIsEditOpen, setEditData }) {
    let pathname = usePathname()
    const [selectedSort, setSelectedSort] = useState('Sort');
    const { GET_MEDIA_PROVIDER } = useUserContext();

    let [defaultValue, setDefaultValue] = useState();
    let [defaultValue2, setDefaultValue2] = useState();





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







    const statusS = [
        {
            key: 'CURRENT', label: pathname.includes('/anime/') ? 'Watching' : 'Reading',

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
            key: 'REPEATING', label: pathname.includes('/anime/') ? 'Rewatching' : 'Rereading'
        }

    ]







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







    const { userInfo } = useUser()





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
        refetchQueries: [{ query: GET_MEDIA_PROVIDER, variables: { userId: userInfo?.id, type: pathname.includes('/anime/') ? 'ANIME' : 'MANGA', sort: undefined } }],
    });



    const [saveFavourite] = useMutation(SAVE_FAVOURITE, {
        refetchQueries: [{ query: GET_MEDIA_PROVIDER, variables: { userId: userInfo?.id, type: pathname.includes('/anime/') ? 'ANIME' : 'MANGA', sort: undefined } }],
    })

    const [deleteMedia] = useMutation(DELETE_MEDIA_LIST_ENTRY, {
        refetchQueries: [{ query: GET_MEDIA_PROVIDER, variables: { userId: userInfo?.id, type: pathname.includes('/anime/') ? 'ANIME' : 'MANGA', sort: undefined } }],
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






    const handleSaveFavourite = async () => {
        try {
            const variables = pathname.includes('/manga/')
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
        chujec = pathname.includes('/anime/') ? 'Watching' : 'Reading'
    } else if (editData.status === "PLANNING") {
        chujec = 'Planning'
    } else if (editData.status === "COMPLETED") {
        chujec = "Completed"
    } else if (editData.status === "DROPPED") {
        chujec = 'Dropped'
    } else if (editData.status === "PAUSED") {
        chujec = 'Paused'
    } else if (editData.status === "REPEATING") {
        chujec = pathname.includes('/anime/') ? 'Rewatching' : 'Rereading'
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
                            <div className={`input-wrap ${pathname.includes('/anime/') ? "" : "manga"}`}>
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
                                    <div className="input-title">{pathname.includes('/anime/') ? 'Episode Progress' : 'Chapter Progress'}</div>
                                    <div className="el-input-number is-controls-right">
                                        <span className="el-input-number__decrease" onClick={() => handleDecrease('progress', 0)}>
                                            <i className="el-icon-arrow-down"></i>
                                        </span>
                                        <span className="el-input-number__increase" onClick={() => handleIncrease('progress', editData.episodes || Infinity)}>
                                            <i className="el-icon-arrow-up"></i>
                                        </span>
                                        <div className="el-input">
                                            <input
                                                type="number"
                                                value={editData.progress !== '' ? editData.progress : ''}
                                                onChange={(e) => {
                                                    let value = e.target.value;

                                                    // Pozwól na pustą wartość, aby użytkownik mógł usuwać wpis
                                                    if (value === '') {
                                                        setEditData(prev => ({ ...prev, progress: '' }));
                                                        return;
                                                    }

                                                    let numValue = Number(value);
                                                    const maxLimit = editData.episodes ?? Infinity;

                                                    if (isNaN(numValue) || numValue < 0) {
                                                        numValue = 0;
                                                    }

                                                    if (numValue > maxLimit) {
                                                        numValue = maxLimit;
                                                    }

                                                    setEditData(prev => ({ ...prev, progress: numValue }));
                                                }}
                                                autoComplete="off"
                                                max={editData.episodes ?? undefined}
                                                min="0"
                                                className="el-input__inner"
                                                role="spinbutton"
                                                aria-valuemax={editData.episodes ?? undefined}
                                                aria-valuemin="0"
                                                aria-valuenow={typeof editData.progress === 'number' ? editData.progress : 0}
                                                aria-disabled="false"
                                            />
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


                                {pathname.includes('/manga/') && <><div className="form repeat2">
                                    <div className="input-title">Total Rereads</div>
                                    <div className="el-input-number is-controls-right">
                                        <span className="el-input-number__decrease" onClick={() => handleDecrease('repeat', 0)}>
                                            <i className="el-icon-arrow-down"></i>
                                        </span>
                                        <span className="el-input-number__increase" onClick={() => handleIncrease('repeat', Infinity)}>
                                            <i className="el-icon-arrow-up"></i>
                                        </span>
                                        <div className="el-input">
                                            <input type="number" value={editData.repeat} onChange={(e) => {
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
                                                <input
                                                    type="number"
                                                    value={editData.volumes !== '' ? editData.volumes : ''}
                                                    onChange={(e) => {
                                                        let value = e.target.value;

                                                        if (value === '') {
                                                            setEditData(prev => ({ ...prev, volumes: '' }));
                                                            return;
                                                        }

                                                        let numValue = Number(value);
                                                        const maxLimit = editData.volumesCount ?? 10;

                                                        if (isNaN(numValue) || numValue < 0) {
                                                            numValue = 0;
                                                        }

                                                        if (numValue > maxLimit) {
                                                            numValue = maxLimit;
                                                        }

                                                        setEditData(prev => ({ ...prev, volumes: numValue }));
                                                    }}
                                                    autoComplete="off"
                                                    max={editData.volumesCount ?? 10}
                                                    min="0"
                                                    className="el-input__inner"
                                                    role="spinbutton"
                                                    aria-valuemax={editData.volumesCount ?? 10}
                                                    aria-valuemin="0"
                                                    aria-valuenow={typeof editData.volumes === 'number' ? editData.volumes : 0}
                                                    aria-disabled="false"
                                                />
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



                                {pathname.includes('/anime/') && <div className="form repeat2">
                                    <div className="input-title">Total Rewatches</div>
                                    <div className="el-input-number is-controls-right">
                                        <span className="el-input-number__decrease" onClick={() => handleDecrease('repeat', 0)}>
                                            <i className="el-icon-arrow-down"></i>
                                        </span>
                                        <span className="el-input-number__increase" onClick={() => handleIncrease('repeat', Infinity)}>
                                            <i className="el-icon-arrow-up"></i>
                                        </span>
                                        <div className="el-input">
                                            <input type="number" value={editData.repeat} onChange={(e) => {
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
        </>
    );
}
