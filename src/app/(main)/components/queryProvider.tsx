'use client'
import { gql, useQuery } from "@apollo/client";
import React,{ createContext, useContext } from "react";
import {useUser} from "@/src/app/(main)/components/userInfoWrapper";
import {useMemo} from "react";
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
        medium
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
        medium
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
            medium
            extraLarge
            large
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
            medium
            extraLarge
            large
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
    coverImage: { extraLarge: string, medium: string, large: string }
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

    // KLUCZOWE: Memoizacja stałych wartości
    const queryConstants = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let nextYear = currentYear;
        let season = '';
        if (currentMonth >= 12 || currentMonth <= 2) {
            season = 'WINTER';
        } else if (currentMonth >= 3 && currentMonth <= 5) {
            season = 'SPRING';
        } else if (currentMonth >= 6 && currentMonth <= 8) {
            season = 'SUMMER';
        } else if (currentMonth >= 9 && currentMonth <= 11) {
            season = 'FALL';
            nextYear = currentYear + 1;
        }

        let seasonNext = '';
        if (season === "WINTER") {
            seasonNext = "SPRING";
        } else if (season === "SPRING") {
            seasonNext = "SUMMER";
        } else if (season === "SUMMER") {
            seasonNext = "FALL";
        } else if (season === "FALL") {
            seasonNext = "WINTER";
        }

        return {
            season,
            seasonNext,
            seasonYear: currentYear,
            seasonYearNext: nextYear,
            // Stałe wartości
            sortManga: "TRENDING_DESC",
            isAdultManga: false,
            typeManga: "MANGA",
            sortPopular: "TRENDING_DESC",
            isAdultPopular: false,
            typePopular: "ANIME",
            isAdultNext: false,
            typeNext: "ANIME",
            isAdultSeason: false,
            typeSeason: "ANIME",
            sortEmission: "TRENDING_DESC",
            isAdultEmission: false,
            typeEmission: "ANIME",
            statusEmission: "RELEASING"
        };
    }, []);

    // Memoizacja variables dla user-specific queries
    const userQueryVariables = useMemo(() => ({
        activity: {
            page: 1,
            perPage: 20,
            userId: userInfo?.id,
            sort: "ID_DESC"
        },
        stats: {
            userId: userInfo?.id,
            sort: 'PROGRESS_DESC'
        },
        media: {
            userId: userInfo?.id,
            type: "ANIME"
        }
    }), [userInfo?.id]);

    // Manga query
    const { data: dataManga, loading: loadingManga, error: errorManga } = useQuery(GET_DATA, {
        variables: {
            sort: queryConstants.sortManga,
            isAdult: queryConstants.isAdultManga,
            type: queryConstants.typeManga
        },
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
    });

    // Popular query
    const { data: dataPopular, loading: loadingPopular, error: errorPopular } = useQuery(GET_DATA_POPULAR, {
        variables: {
            sort: queryConstants.sortPopular,
            isAdult: queryConstants.isAdultPopular,
            type: queryConstants.typePopular
        },
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
    });

    // Next season query
    const { data: dataNext, loading: loadingNext, error: errorNext } = useQuery(GET_DATA_NEXTSEASON, {
        variables: {
            isAdult: queryConstants.isAdultNext,
            type: queryConstants.typeNext,
            season: queryConstants.seasonNext,
            seasonYear: queryConstants.seasonYearNext
        },
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
    });

    // Current season query
    const { data: dataSeason, loading: loadingSeason, error: errorSeason } = useQuery(GET_MEDIA_SEASON, {
        variables: {
            season: queryConstants.season,
            seasonYear: queryConstants.seasonYear,
            isAdult: queryConstants.isAdultSeason,
            type: queryConstants.typeSeason
        },
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
    });

    // Emission query
    const { data: dataEmission, loading: loadingEmission, error: errorEmission } = useQuery(GET_DATA_EMISSION, {
        variables: {
            type: queryConstants.typeEmission,
            sort: queryConstants.sortEmission,
            status: queryConstants.statusEmission,
            isAdult: queryConstants.isAdultEmission
        },
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
    });

    // User-specific queries - skip if no user
    const { data: activityData, error: activityError, loading: activityLoading, fetchMore: fetchMoreActivity } = useQuery(GET_ACTIVITY, {
        variables: userQueryVariables.activity,
        skip: !userInfo?.id,
        fetchPolicy: 'cache-first', // Zmienione z 'no-cache' dla lepszej performance
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
    });

    const { data: statsData, loading: statsLoading } = useQuery(STATS_LIST, {
        variables: userQueryVariables.stats,
        skip: !userInfo?.id,
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
    });

    const { data: mediaData, loading: mediaLoading } = useQuery(MediaList, {
        variables: userQueryVariables.media,
        skip: !userInfo?.id,
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
        errorPolicy: 'all',
    });

    // KLUCZOWE: Memoizacja context value
    const contextValue = useMemo(() => ({
        dataManga,
        loadingManga,
        errorManga,
        dataPopular,
        loadingPopular,
        errorPopular,
        dataNext,
        loadingNext,
        errorNext,
        dataSeason,
        loadingSeason,
        errorSeason,
        dataEmission,
        loadingEmission,
        errorEmission,
        activityData,
        activityError,
        activityLoading,
        fetchMoreActivity,
        statsData,
        statsLoading,
        mediaData,
        mediaLoading,
        season: queryConstants.season,
        seasonYear: queryConstants.seasonYear
    }), [
        dataManga, loadingManga, errorManga,
        dataPopular, loadingPopular, errorPopular,
        dataNext, loadingNext, errorNext,
        dataSeason, loadingSeason, errorSeason,
        dataEmission, loadingEmission, errorEmission,
        activityData, activityError, activityLoading, fetchMoreActivity,
        statsData, statsLoading, mediaData, mediaLoading,
        queryConstants.season, queryConstants.seasonYear
    ]);

    return (
        <QueryContext.Provider value={contextValue}>
            {children}
        </QueryContext.Provider>
    );
};

export const useQueryContext = (): QueryInterface => {
    const context = useContext(QueryContext);
    if (!context) {
        throw new Error("useQueryContext must be used within a QueryProvider");
    }
    return context;
};
