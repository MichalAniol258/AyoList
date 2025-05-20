'use client'
import { gql, useQuery } from "@apollo/client";
import React,{ createContext, useContext } from "react";
import {useUser} from "@/src/app/components/userInfoWrapper";
const GET_DATA = gql`
query SearchAnime(
  $countryOfOrigin: CountryCode,
  $type: MediaType, 
  $search: String, 
  $isAdult: Boolean, 
  $genreIn: [String], 
  $seasonYear: Int, 
  $season: MediaSeason, 
  $format: MediaFormat,
  $status: MediaStatus,
  $sort: [MediaSort]
) {
  Page {
    media(
      countryOfOrigin: $countryOfOrigin
      type: $type, 
      search: $search, 
      isAdult: $isAdult, 
      genre_in: $genreIn, 
      seasonYear: $seasonYear, 
      season: $season, 
      format: $format,
      status: $status,
      sort: $sort
    ) {
      id
      title {
        romaji
        english
      }
      coverImage {
        extraLarge
      }
        nextAiringEpisode {
        episode
        airingAt
      }
      meanScore
      averageScore
      format
      genres
      episodes
      endDate {
        year
      }
      startDate {
        year
      }
      duration
      chapters
      studios (isMain: true) {
        edges {
          node {
            name
          }
        }
      }
      status
      season
      seasonYear
    }
  }
}
`;



const GET_DATA_POPULAR = gql`
query Query($type: MediaType,$sort: [MediaSort], $startDate: FuzzyDateInt, $episodes: Int, $formatIn: [MediaFormat], $isAdult: Boolean) {
  Page {
    media(type: $type,sort: $sort, startDate: $startDate, episodes: $episodes,  isAdult: $isAdult, format_in: $formatIn) {
      id
      title {
        romaji
        english
      }
      description
      coverImage {
        large
        extraLarge
      }
      nextAiringEpisode {
        episode
        airingAt
      }
      meanScore
      averageScore
      format
      genres
      episodes
        endDate {
        year
      }
      startDate {
        year
      }
      duration
      chapters
    }
  }
}
`;


const GET_DATA_NEXTSEASON = gql`
query Query($type: MediaType, $startDate: FuzzyDateInt,$status: MediaStatus,$season: MediaSeason, $seasonYear: Int,$isAdult: Boolean) {
  Page {
    media(type: $type,startDate: $startDate,status: $status,isAdult: $isAdult,season: $season, seasonYear: $seasonYear, sort: [POPULARITY_DESC]) {
      id
      title {
        romaji
        english
      }
      description
      episodes
      coverImage {
        medium
        extraLarge
        large
      }
      nextAiringEpisode {
        episode
        airingAt
      }
      meanScore
      averageScore
      format
      genres
      episodes
        endDate {
        year
      }
      startDate {
        year
      }
      duration
      chapters
    }
  }
}

`;


const GET_MEDIA_SEASON = gql`
query Query($type: MediaType,$season: MediaSeason, $seasonYear: Int,$isAdult: Boolean) {
  Page {
    media(type: $type,isAdult: $isAdult,season: $season, seasonYear: $seasonYear, sort: [POPULARITY_DESC]) {
      id
      title {
        romaji
        english
      }
      description
      episodes
      coverImage {
        medium
        extraLarge
      }
      nextAiringEpisode {
        episode
        airingAt
      }
      meanScore
      averageScore
      format
      genres
      episodes
        endDate {
        year
      }
      startDate {
        year
      }
      duration
      chapters
    }
  }
}

`;

const GET_DATA_EMISSION = gql`
query Query($status: MediaStatus, $sort: [MediaSort], $type: MediaType, $isAdult: Boolean){
  Page {
    media (status: $status, sort: $sort, type: $type, isAdult: $isAdult){
      id
      title {
        romaji
        english
      }
      coverImage {
        large
        extraLarge
      }
      nextAiringEpisode {
      episode
        airingAt
      }
      meanScore
    }
  }
}
`;

const GET_ACTIVITY = gql`
query Query($userId: Int, $sort: [ActivitySort], $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    activities(userId: $userId, sort: $sort) {
      ... on ListActivity {
        id
        userId
        type
        replyCount
        status
        progress
        isLocked
        isSubscribed
        likeCount
        isLiked
        isPinned
        siteUrl
        createdAt
        user {
          id
          name
        }
        media {
        type
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
          }
          id
        }
      }
    }
    pageInfo {
      hasNextPage
      currentPage
    }
  }
}
`;

const STATS_LIST = gql`
query User($userId: Int, $sort: [UserStatisticsSort], $releaseYearsSort2: [UserStatisticsSort]) {
  User(id: $userId) {
    statistics {
      anime {
        count
        episodesWatched
        meanScore
        standardDeviation
        minutesWatched
        statuses {
          minutesWatched
          status
          chaptersRead
          count
          meanScore
          mediaIds
        }
        scores {
          score
          minutesWatched
          meanScore
          count
          chaptersRead
          mediaIds
        }
        lengths {
          length
          chaptersRead
          count
          meanScore
          mediaIds
          minutesWatched
        }
        countries {
          chaptersRead
          count
          country
          meanScore
          mediaIds
          minutesWatched
        }
        formats {
          chaptersRead
          count
          format
          meanScore
          mediaIds
          minutesWatched
        }
        releaseYears(sort: $releaseYearsSort2) {
          chaptersRead
          count
          meanScore
          mediaIds
          minutesWatched
          releaseYear
        }
        startYears {
          chaptersRead
          count
          meanScore
          mediaIds
          minutesWatched
          startYear
        }
        genres {
          chaptersRead
          count
          genre
          meanScore
          mediaIds
          minutesWatched
        }
        staff {
          chaptersRead
          count
          meanScore
          mediaIds
          minutesWatched
        }
        tags {
          chaptersRead
          count
          meanScore
          mediaIds
          minutesWatched
        }
      }
      manga {
        count
        chaptersRead
        meanScore
        standardDeviation
        volumesRead
        scores {
          chaptersRead
          count
          meanScore
          mediaIds
          score
          minutesWatched
        }
        lengths {
          chaptersRead
          count
          length
          meanScore
          mediaIds
          minutesWatched
        }
        formats {
          chaptersRead
          count
          format
          meanScore
          mediaIds
          minutesWatched
        }
        countries {
          chaptersRead
          count
          country
          meanScore
          mediaIds
          minutesWatched
        }
        statuses {
          chaptersRead
          count
          meanScore
          mediaIds
          minutesWatched
          status
        }
        releaseYears(sort: $sort) {
          chaptersRead
          count
          meanScore
          mediaIds
          minutesWatched
          releaseYear
        }
        startYears {
          chaptersRead
          count
          meanScore
          mediaIds
          minutesWatched
          startYear
        }
      }
    }
  }
}`


const MediaList = gql`
query Query($userId: Int, $type: MediaType) {
  MediaListCollection(userId: $userId, type: $type) {
    lists {
      entries {
        media {
          genres
          coverImage {
            extraLarge
          }
          type
        }
      }
    }
  }
}`


interface Genre {
    genre: string;
    minutesWatched: number;
    meanScore: number;
    count: number;
}

interface Anime {
    genres: Genre[];
}

interface Manga {
    genres: Genre[];
}

interface Statistics {
    statistics: { anime: Anime; manga: Manga };
}
interface media {
    coverImage: { extraLarge: string }
    genres: string
    type: string
}
interface entries {
    media: media
}

interface lists {
    entries: entries[]
}

interface MediaListCollection {
    lists: lists[];
}
interface User {
    User: Statistics;
    MediaListCollection: MediaListCollection;
}

    interface QueryInterface {
        dataManga: unknown;
        loadingManga: boolean;
        errorManga: unknown;
        dataPopular: unknown;
        loadingPopular: boolean;
        errorPopular: unknown;
        dataNext: unknown;
        loadingNext: boolean;
        errorNext: unknown;
        dataSeason: unknown;
        loadingSeason: boolean;
        errorSeason: unknown;
        dataEmission: unknown;
        loadingEmission: boolean;
        errorEmission: unknown;
        season: string;
        seasonYear: number;
        activityData: unknown;
        activityError: unknown;
        activityLoading: boolean;
        fetchMoreActivity: unknown;
        statsData: User;
        statsLoading: boolean;
        mediaData: User;
        mediaLoading: boolean;
    }


    const QueryContext = createContext<QueryInterface | undefined>(undefined);



export const QueryProvider = ({children}:{children:React.ReactNode}) => {
    const { userInfo } = useUser();
    const sortManga = "TRENDING_DESC"
    const isAdultManga = false
    const typeManga = "MANGA"

    const sortPopular = "TRENDING_DESC"
    const isAdultPopular = false
    const typePopular = "ANIME"

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const isAdultNext = false;
    const typeNext = "ANIME"


    let season = '';
    const seasonYear = currentYear
    if (currentMonth >= 12 || currentMonth <= 2) {
        season = 'WINTER';
    } else if (currentMonth >= 3 && currentMonth <= 5) {
        season = 'SPRING';
    } else if (currentMonth >= 6 && currentMonth <= 8) {
        season = 'SUMMER';
    } else if (currentMonth >= 9 && currentMonth <= 11) {
        season = 'FALL';
    }

    let seasonNext = '';
    if (season === "WINTER") {
        seasonNext = "SPRING"
    } else if (season === "SPRING") {
        seasonNext = "SUMMER"
    } else if (season === "SUMMER") {
        seasonNext = "FALL"
    }

    const isAdultSeason = false;
    const typeSeason = "ANIME"

    const sortEmission = "TRENDING_DESC"
    const isAdultEmission = false
    const typeEmission = "ANIME"
    const statusEmission = "RELEASING"

    const { data: dataManga, loading:loadingManga, error:errorManga } = useQuery(GET_DATA, {
        variables: { sort:sortManga, isAdult:isAdultManga, type:typeManga },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const { data: dataPopular, loading:loadingPopular, error: errorPopular } = useQuery(GET_DATA_POPULAR, {
        variables: { sort: sortPopular, isAdult: isAdultPopular, type: typePopular },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const { data:dataNext, loading:loadingNext, error:errorNext } = useQuery(GET_DATA_NEXTSEASON, {
        variables: { isAdult:isAdultNext, type:typeNext, season: seasonNext, seasonYear },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    })

    const { data:dataSeason, loading:loadingSeason, error: errorSeason } = useQuery(GET_MEDIA_SEASON, {
        variables: { season, seasonYear, isAdult:isAdultSeason, type:typeSeason },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    })

    const { data: dataEmission, loading:loadingEmission, error:errorEmission } = useQuery(GET_DATA_EMISSION, {
        variables: { type:typeEmission, sort:sortEmission, status:statusEmission, isAdult:isAdultEmission },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const { data: activityData, error: activityError, loading: activityLoading, fetchMore: fetchMoreActivity } = useQuery(GET_ACTIVITY, {
        variables: {
            page: 1,
            perPage: 20,
            userId: userInfo?.id,
            sort: "ID_DESC"
        },
        skip: !userInfo,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const { data: statsData, loading: statsLoading } = useQuery(STATS_LIST, {
        variables: {
            userId: userInfo?.id, sort: 'PROGRESS_DESC'
        }
    })

    const { data: mediaData, loading: mediaLoading } = useQuery(MediaList, {
        variables: {
            userId: userInfo?.id, type: "ANIME",
        }
    })







    return (
        <QueryContext.Provider value={{dataManga, loadingManga, errorManga,
            dataPopular, loadingPopular, errorPopular,
            dataNext, loadingNext, errorNext,
            dataSeason, loadingSeason, errorSeason,
            dataEmission, loadingEmission, errorEmission,
            activityData, activityError, activityLoading, fetchMoreActivity,
            statsData, statsLoading, mediaData, mediaLoading,
            season, seasonYear}}>
            {children}
        </QueryContext.Provider>
    )
}


export const useQueryContext = (): QueryInterface => {
    const context = useContext(QueryContext);
    if (!context) {
        throw new Error("useQueryContext must be used within a QueryProvider");
    }
    return context;
}
