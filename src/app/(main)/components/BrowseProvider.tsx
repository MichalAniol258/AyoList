"use client"
import React, {createContext, useContext, useState} from 'react';
import {gql, useLazyQuery, useQuery} from "@apollo/client";
import {usePathname} from "next/navigation";


const SEARCH_ANIME = gql`
query SearchAnime(
  $countryOfOrigin: CountryCode,
  $type: MediaType, 
  $search: String, 
  $isAdult: Boolean, 
  $genreIn: [String], 
  $seasonYear: Int, 
  $season: MediaSeason, 
  $format: MediaFormat,
  $status: MediaStatus
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
      status: $status
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


const GET_MEDIA = gql`
query Query(
  $status: MediaStatus,
  $season: MediaSeason,
  $genreIn: [String],
  $seasonYear: Int,
  $isAdult: Boolean,
  $sort: [MediaSort],
  $format: MediaFormat,
  $countryOfOrigin: CountryCode,
  $type: MediaType, 
  $page: Int,
  $perPage: Int
) {
  Page(page: $page, perPage: $perPage) {
    media(
      countryOfOrigin: $countryOfOrigin,
      type: $type, 
      status: $status,
      isAdult: $isAdult,
      season: $season,
      genre_in: $genreIn,
      seasonYear: $seasonYear,
      sort: $sort,
      format: $format
    ) {
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
    pageInfo {
      currentPage
      lastPage
      hasNextPage
    }
  }
}
`;


const GET_COLLECTION = gql`
  query Query {
    GenreCollection
  }
`;

interface BrowseContextType {
    searchAnime: unknown;
    data: unknown;
    error: unknown;
    loading: boolean;
    PopularData: unknown;
    PopularLoading: boolean;
    PopularError: unknown;
    seasonalData: unknown;
    seasonalLoading: boolean;
    seasonalError: unknown;
    allTimeData: unknown;
    allTimeLoading: boolean;
    allTimeError: unknown;
    dataGenres: unknown;
    errorGenres: unknown;
    loadingGenres: boolean;
    nextData: unknown;
    nextLoading: boolean;
    nextError: unknown;
    fetchMore: unknown;
    setVisible: unknown;
    setSelectedKeys: unknown;
    selectedKeys: unknown;
    nextYear: number;
    season: string;
    seasonYear: number;
    seasonNext: string;
    seasonNextYear: number;
    clearTag: number;
    isVisible: boolean;
    sortArray: string;
    type: string;
    format: string;
    statusSearch: string;
    countryOfOrigin: string;
    genres: unknown;
    year: string;
    season2: string;
}
const BrowseContext = createContext<BrowseContextType | undefined>(undefined);

export const BrowseProvider = ({children}:{children:React.ReactNode}) => {


    const pathname = usePathname();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const nextYear = new Date().getFullYear();

    let season = "";
    const seasonYear = currentYear;
    if (currentMonth >= 12 || currentMonth <= 2) {
        season = 'WINTER';
    } else if (currentMonth >= 3 && currentMonth <= 5) {
        season = 'SPRING';
    } else if (currentMonth >= 6 && currentMonth <= 8) {
        season = 'SUMMER';
    } else if (currentMonth >= 9 && currentMonth <= 11) {
        season = 'FALL';
    }

    const seasonNextYear = nextYear;
    let seasonNext = ''
    if (season === "WINTER") {
        seasonNext = "SPRING"
    } else if (season === "SPRING") {
        seasonNext = "SUMMER"
    } else if (season === "SUMMER") {
        seasonNext = "FALL"
    }

    let sorter = "TRENDING_DESC"
    const isAdult = false;
    const status = "NOT_YET_RELEASED"
    const formatPopular = "TV"
    const [isVisible, setVisible] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState({
        format: new Set([""]),
        season: new Set([""]),
        year: new Set([""]),
        genres: new Set([""]),
        typeSearch: new Set(["Anime"]),
        country: new Set([""]),
        status: new Set([""]),
        sort: new Set([""])
    });

    const genres = Array.from(selectedKeys.genres)
        .filter((genre) => genre.trim() !== "")
        .map((genre) => genre.replaceAll("_ ", " "))


    const year = Array.from(selectedKeys.year)
        .filter((year) => year !== "")
        .map((year) => year.replaceAll("_ ", " "))
        .join(", ");

    const season2 = Array.from(selectedKeys.season)
        .filter((season) => season !== "")
        .map((season) => season.toUpperCase().replace(" ", "_"))
        .join(", ");



    const statusSearch = Array.from(selectedKeys.status)
        .filter((status) => status !== "")
        .map((status) => status.toUpperCase().replaceAll(" ", "_"))
        .join(", ");

    const countryOfOrigin = Array.from(selectedKeys.country)
        .filter((country) => country !== "")
        .map((country) =>
            country
                .replace("Japan", "JP")
                .replace("Taiwan", "TW")
                .replace("South Korea", "KR")
                .replace("China", "CN")
        )
        .join(", ");

    const sortArray = Array.from(selectedKeys.sort)
        .filter((sort) => sort !== "")
        .map((sort) =>
            sort
                .replace("Popularity", "POPULARITY_DESC")
                .replace("Trending", "TRENDING_DESC")
                .replace("Release Date", "START_DATE_DESC")
                .replace("Average Score", "SCORE_DESC")
        )
        .join(", ");



    const format = Array.from(selectedKeys.format)
        .filter((format) => format !== "")
        .map((format) => format.toUpperCase().replace(" ", "_")) // Dopasowanie do formatów enumów
        .join(", ");

    const type = Array.from(selectedKeys.typeSearch)
        .filter((typeSearch) => typeSearch !== "")
        .map((typeSearch) => typeSearch.toUpperCase().replace(" ", "_"))
        .join(", ");

    const clearTag = Object.values(selectedKeys).reduce((acc, set) => acc + Array.from(set).filter((item) => item !== "").length, 0)

    const [searchAnime, { data, error, loading }] = useLazyQuery(SEARCH_ANIME, {
        fetchPolicy: 'cache-and-network',
    })

    const { data: PopularData, loading: PopularLoading, error: PopularError } = useQuery(GET_MEDIA, {
        variables: {
            isAdult, sort: sortArray === "" ? sorter : sortArray, type: type,
            countryOfOrigin: countryOfOrigin || undefined,
            status: statusSearch || undefined,
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    sorter = "POPULARITY_DESC"


    const { data: seasonalData, loading: seasonalLoading, error: seasonalError, fetchMore } = useQuery(GET_MEDIA, {
        variables: {
            page: 1,
            perPage: 20,
            type: type,
            countryOfOrigin: !selectedKeys.typeSearch.has("Anime") ? (clearTag > 1 && selectedKeys.typeSearch.has("Manga")
                ? (countryOfOrigin || undefined) :
                "KR") : (countryOfOrigin || undefined),

            status: statusSearch || undefined, season: !pathname.includes("/Browse/alltimeAll")
                ? (selectedKeys.typeSearch.has("Anime")
                    ? (isVisible ? season2 || undefined : season)
                    : undefined)
                : undefined, seasonYear: !pathname.includes("/Browse/alltimeAll")
                ? (selectedKeys.typeSearch.has("Anime")
                    ? (isVisible ? year || undefined : seasonYear)
                    : undefined)
                : undefined, isAdult, sort: sortArray === "" ? sorter : sortArray, format: format || undefined, genreIn: genres.length > 0 ? genres : undefined
        },
        fetchPolicy: 'no-cache',
    });

    const { data: allTimeData, loading: allTimeLoading, error: allTimeError } = useQuery(GET_MEDIA, {
        variables: {
            isAdult, sort: sortArray === "" ? sorter : sortArray, type: type,
            countryOfOrigin: countryOfOrigin || undefined,
            status: statusSearch || undefined,
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const { data: dataGenres, error: errorGenres, loading: loadingGenres } = useQuery(GET_COLLECTION, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    })



    const { data: nextData, loading: nextLoading, error: nextError } = useQuery(GET_MEDIA, {
        variables: { isAdult, sort: sortArray === "" ? sorter : sortArray, season: seasonNext, seasonYear: seasonNextYear, status, format: formatPopular },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    return (
        <BrowseContext.Provider value={{
            searchAnime, data, error, loading,
            PopularData, PopularLoading, PopularError,
            seasonalData, seasonalLoading, seasonalError,
            allTimeData, allTimeLoading, allTimeError,
            dataGenres, errorGenres, loadingGenres,
            nextData, nextLoading, nextError,
            fetchMore, setVisible, setSelectedKeys,
            selectedKeys, nextYear, season,
            seasonYear, seasonNext, seasonNextYear, clearTag, isVisible,
            sortArray, type, format, statusSearch, countryOfOrigin, genres, year, season2,

        }}>
            {children}
        </BrowseContext.Provider>
    )
}


export const useBrowseContext = (): BrowseContextType => {
    const context = useContext(BrowseContext);
    if (!context) {
        throw new Error("useBrowseContext must be used within a BrowseProvider");
    }
    return context;
}
