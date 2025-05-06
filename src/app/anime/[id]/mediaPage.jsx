"use client";
import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {useEffect, useState} from 'react';
import { useUserContext } from '../../components/userListWrapper'
import EditComponent from '../../components/EditComponent'
import { useUser } from "../../components/userInfoWrapper";
const GET_ANIME_DETAILS = gql`
query ($mediaId: Int) {
  Media(id: $mediaId) {
    id
    title {
      romaji
      english
      native
    }
    format
    genres
    countryOfOrigin
    coverImage {
      large
      extraLarge
    }
    meanScore
    episodes
    status
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    popularity
    volumes
    chapters
    isFavourite
    bannerImage
    averageScore
    duration
    description
    favourites
    hashtag
    nextAiringEpisode {
      timeUntilAiring
      mediaId
  
      airingAt
      episode
    }
    type
    tags {
      rank
      name
      isMediaSpoiler
      description
      category
      id
      isAdult
      isGeneralSpoiler
    }
    synonyms
    seasonYear
    season
    rankings {
      allTime
      context
      format
      id
      rank
      season
      type
      year
    }
    streamingEpisodes {
      title
      url
    }
    staff {
      edges {
        node {
          id
        }
      }
    }
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

export default function MediaPage({ mediaId, setLoadingDone  }) {
    const { userList, userListManga, GET_MEDIA_PROVIDER } = useUserContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
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
    const pathname = usePathname()

    const { userInfo } = useUser()
    const [saveFavourite] = useMutation(SAVE_FAVOURITE, {
        refetchQueries: [{ query: GET_MEDIA_PROVIDER, variables: { userId: userInfo?.id, type: pathname.includes('/anime/') ? 'ANIME' : 'MANGA', sort: undefined } }],
    })

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


    const { loading, data } = useQuery(GET_ANIME_DETAILS, {
        variables: { mediaId: parseInt(mediaId) },
        onCompleted: () => {
            setLoadingDone(true);
        }
    });





    const anime = data?.Media;
    const cos = pathname.includes('/anime/') ? userList : userListManga



    const entries = cos?.MediaListCollection?.lists?.flatMap(list => list.entries) || [];
    const entry = entries?.find(entry => entry.mediaId === parseInt(mediaId)) || null;




    const handleEdit = (mode, mediaId) => {
        if (mode === "edit") {




            console.log(mediaId)

            setEditData({
                mediaId: anime.id,
                episodes: entry?.media?.episodes ?? anime.episodes,
                chapters: entry?.media?.chapters ?? anime.chapters,
                volumes: entry?.progressVolumes ?? 0,
                volumesCount: entry?.media?.volumes ?? anime.volumes,
                status: entry?.status ?? "Status",
                score: entry?.score ?? 0,
                progress: entry?.progress ?? 0,
                notes: entry?.notes ?? "",
                repeat: entry?.repeat ?? 0,
                name: anime?.title?.english ?? anime?.title?.romaji ?? "",
                banner: anime?.bannerImage ?? "",
                img: anime?.coverImage?.large ?? "",
                favourite: entry?.media?.isFavourite ?? false,
                startDateYear: entry?.startedAt?.year ?? 0,
                startDateMonth: entry?.startedAt?.month ?? 0,
                startDateDay: entry?.startedAt?.day ?? 0,
                endDateYear: entry?.completedAt?.year ?? 0,
                endDateMonth: entry?.completedAt?.month ?? 0,
                endDateDay: entry?.completedAt?.day ?? 0,
                id: entry?.id ?? anime?.id
            });


            setIsEditOpen(true);

        } else {
            setIsEditOpen(false);
        }
    };



    const truncatedDescription = anime?.description?.length > 730
        ? anime?.description.substring(0, 730) + '...'
        : anime?.description;

    const handleReadMoreClick = () => {
        setIsExpanded(!isExpanded);
    };

    const nav = [
        {
            name: 'Overview',
            url: `/${pathname.includes('/anime/') ? 'anime' : 'manga'}/${mediaId}`
        },
        ...(anime?.streamingEpisodes.length > 0
            ? [{ name: 'Watch', url: `/anime/${mediaId}/watch` }]
            : []),
        {
            name: 'Characters',
            url: `/${pathname.includes('/anime/') ? 'anime' : 'manga'}/${mediaId}/characters`
        },
        ...(anime?.staff.length > 0
            ? [{ name: 'Staff', url: `/anime/${mediaId}/staff` }]
            : []),
        {
            name: 'Stats',
            url: `/${pathname.includes('/anime/') ? 'anime' : 'manga'}/${mediaId}/stats`
        },
    ];




    let chujec = ''; // Poprawna deklaracja
if (!loading) {
    switch (entry?.status) {
        case "CURRENT":
            chujec = pathname.includes('/anime/') ? 'Watching' : 'Reading';
            break;
        case "PLANNING":
            chujec = 'Planning';
            break;
        case "COMPLETED":
            chujec = 'Completed';
            break;
        case "DROPPED":
            chujec = 'Dropped';
            break;
        case "PAUSED":
            chujec = 'Paused';
            break;
        case "REPEATING":
            chujec = pathname.includes('/anime/') ? 'Rewatching' : 'Rereading';
            break;
        default:
            chujec = '';
    }
}


    console.log(chujec); // Sprawdzenie poprawności działania



    return (
        <><EditComponent editData={editData} isEditOpen={isEditOpen} setEditData={setEditData} setIsEditOpen={setIsEditOpen} />
            <div className="media-page" >


                <div className="header-wrap">

                    {<div className="banner" style={{
                        backgroundImage: anime?.bannerImage ? `url(${anime?.bannerImage})` : `url(/images/cat.jpg)`,
                        position: 'relative',
                    }}>

                        <div className="shadow">


                        </div>
                    </div>}




                    <div className="header-media">
                        <div className="contentContainer" style={{
                            minHeight: '250px'
                        }}>
                            <div className="cover-wrap" style={{
                                marginTop: !anime?.bannerImage ? '0' : ''
                            }}>
                                <div className="cover-wrap-inner" style={{
                                    position: !anime?.bannerImage ? 'static' : ''
                                }}>
                                    <img
                                        className='cover-media'
                                        src={anime?.coverImage?.large}
                                        alt={anime?.title?.english || anime?.title?.romaji}
                                    />

                                    <div className='actions'>
                                        <div className='list-media'>
                                            <div className='add-media' onClick={() => handleEdit('edit', mediaId)}>{chujec || "Add to List"}</div>
                                            <div className='dropdown el-dropdown'>
                                                <span className='el-dropdown-link el-dropdown-selfdefine'>
                                                    <i data-v-5776f768="" class="el-icon-arrow-down el-icon--right"></i>
                                                </span>
                                            </div>

                                        </div>

                                        <div className="favourite-media" onClick={() => handleSaveFavourite()}>
                                            <svg data-v-0228dea0="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={`heartSvg ${editData.favourite ? "heartFv" : ""}`}><path data-v-0228dea0="" fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="content-media">

                                <h1>{anime?.title?.english || anime?.title?.romaji}</h1>
                                <div className='description-media'>
                                    <p dangerouslySetInnerHTML={{ __html: isExpanded ? anime?.description : truncatedDescription }} />
                                </div>

                                {anime?.description?.length > 730 && <div className='description-length-toggle' onClick={handleReadMoreClick}>
                                    {isExpanded ? 'Read Less' : 'Read More'}
                                </div>}

                                <div className='nav-media'>
                                    {nav.map((item, index) => {
                                        return (<Link key={index} style={{
                                            color: pathname === item.url ? '#14b8a6' : ''
                                        }} className='link-media' href={item.url}>{item.name}</Link>)

                                    })}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
