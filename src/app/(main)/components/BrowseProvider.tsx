"use client"
import React, {createContext, useContext, useState} from 'react';
import {gql, useLazyQuery, useQuery} from "@apollo/client";
import {usePathname} from "next/navigation";
import {useMemo, useCallback} from "react";

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


interface SelectedKeysType {
    format: Set<string>;
    season: Set<string>;
    year: Set<string>;
    genres: Set<string>;
    typeSearch: Set<string>;
    country: Set<string>;
    status: Set<string>;
    sort: Set<string>;
}
const BrowseContext = createContext<BrowseContextType | undefined>(undefined);


export const BrowseProvider = ({children}:{children:React.ReactNode}) => {
    const pathname = usePathname();
    const [isVisible, setVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<SelectedKeysType>({
        format: new Set([""]),
        season: new Set([""]),
        year: new Set([""]),
        genres: new Set([""]),
        typeSearch: new Set(["Anime"]),
        country: new Set([""]),
        status: new Set([""]),
        sort: new Set([""])
    });

    // Memoizowane obliczenia dat i sezonu
    const dateInfo = useMemo(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        let nextYear = currentYear;

        let season = "";
        if (currentMonth >= 12 || currentMonth <= 2) {
            season = 'WINTER';
        } else if (currentMonth >= 3 && currentMonth <= 5) {
            season = 'SPRING';
        } else if (currentMonth >= 6 && currentMonth <= 8) {
            season = 'SUMMER';
        } else if (currentMonth >= 9 && currentMonth <= 11) {
            season = 'FALL';
            nextYear += 1;
        }

        const seasonMapping: Record<string, string> = {
            "WINTER": "SPRING",
            "SPRING": "SUMMER",
            "SUMMER": "FALL",
            "FALL": "WINTER"
        };

        return {
            currentYear,
            nextYear,
            season,
            seasonYear: currentYear,
            seasonNext: seasonMapping[season] || '',
            seasonNextYear: nextYear
        };
    }, []); // Obliczane tylko raz przy inicjalizacji

    // Memoizowane parsowanie kluczy wybranych
    const parsedKeys = useMemo(() => {
        const genres = Array.from(selectedKeys.genres)
            .filter((genre) => genre.trim() !== "")
            .map((genre) => genre.replaceAll("_ ", " "));

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

        const countryMapping: Record<string, string> = {
            "Japan": "JP",
            "Taiwan": "TW",
            "South Korea": "KR",
            "China": "CN"
        };

        const countryOfOrigin = Array.from(selectedKeys.country)
            .filter((country) => country !== "")
            .map((country) => countryMapping[country] || country)
            .join(", ");

        const sortMapping: Record<string, string> = {
            "Popularity": "POPULARITY_DESC",
            "Trending": "TRENDING_DESC",
            "Release Date": "START_DATE_DESC",
            "Average Score": "SCORE_DESC"
        };

        const sortArray = Array.from(selectedKeys.sort)
            .filter((sort) => sort !== "")
            .map((sort) => sortMapping[sort] || sort)
            .join(", ");

        const format = Array.from(selectedKeys.format)
            .filter((format) => format !== "")
            .map((format) => format.toUpperCase().replace(" ", "_"))
            .join(", ");

        const type = Array.from(selectedKeys.typeSearch)
            .filter((typeSearch) => typeSearch !== "")
            .map((typeSearch) => typeSearch.toUpperCase().replace(" ", "_"))
            .join(", ");

        const clearTag = Object.values(selectedKeys).reduce(
            (acc, set) => acc + Array.from(set).filter((item) => item !== "").length,
            0
        );

        return {
            genres,
            year,
            season2,
            statusSearch,
            countryOfOrigin,
            sortArray,
            format,
            type,
            clearTag
        };
    }, [selectedKeys]);

    // Memoizowane zmienne dla zapytań
    const queryVariables = useMemo(() => {
        const isAdult = false;
        const status = "NOT_YET_RELEASED";
        const formatPopular = "TV";
        const popularSorter = "POPULARITY_DESC";

        const baseVariables: Record<string, unknown> = {
            isAdult,
            sort: parsedKeys.sortArray || popularSorter,
            type: parsedKeys.type,
            countryOfOrigin: parsedKeys.countryOfOrigin || undefined,
            status: parsedKeys.statusSearch || undefined,
        };

        const seasonalVariables: Record<string, unknown> = {
            page: 1,
            perPage: 20,
            type: parsedKeys.type,
            countryOfOrigin: !selectedKeys.typeSearch.has("Anime")
                ? (parsedKeys.clearTag > 1 && selectedKeys.typeSearch.has("Manga")
                    ? (parsedKeys.countryOfOrigin || undefined)
                    : "KR")
                : (parsedKeys.countryOfOrigin || undefined),
            status: parsedKeys.statusSearch || undefined,
            season: !pathname.includes("/Browse/alltimeAll")
                ? (selectedKeys.typeSearch.has("Anime")
                    ? (isVisible ? parsedKeys.season2 || undefined : dateInfo.season)
                    : undefined)
                : undefined,
            seasonYear: !pathname.includes("/Browse/alltimeAll")
                ? (selectedKeys.typeSearch.has("Anime")
                    ? (isVisible ? parsedKeys.year || undefined : dateInfo.seasonYear)
                    : undefined)
                : undefined,
            isAdult,
            sort: parsedKeys.sortArray || popularSorter,
            format: parsedKeys.format || undefined,
            genreIn: parsedKeys.genres.length > 0 ? parsedKeys.genres : undefined
        };

        const nextSeasonVariables: Record<string, unknown> = {
            isAdult,
            sort: parsedKeys.sortArray || popularSorter,
            season: dateInfo.seasonNext,
            seasonYear: dateInfo.seasonNextYear,
            status,
            format: formatPopular
        };

        return {
            baseVariables,
            seasonalVariables,
            nextSeasonVariables
        };
    }, [parsedKeys, selectedKeys, isVisible, pathname, dateInfo]);

    // Memoizowane callbacki
    const handleSetVisible = useCallback((visible: boolean) => {
        setVisible(visible);
    }, []);

    const handleSetSelectedKeys = useCallback((keys: SelectedKeysType) => {
        setSelectedKeys(keys);
    }, []);

    // Zapytania GraphQL
    const [searchAnime, { data, error, loading }] = useLazyQuery(SEARCH_ANIME, {
        fetchPolicy: 'cache-and-network',
    });

    const { data: PopularData, loading: PopularLoading, error: PopularError } = useQuery(GET_MEDIA, {
        variables: queryVariables.baseVariables,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const { data: seasonalData, loading: seasonalLoading, error: seasonalError, fetchMore } = useQuery(GET_MEDIA, {
        variables: queryVariables.seasonalVariables,
        fetchPolicy: 'no-cache',
    });

    const { data: allTimeData, loading: allTimeLoading, error: allTimeError } = useQuery(GET_MEDIA, {
        variables: queryVariables.baseVariables,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const { data: dataGenres, error: errorGenres, loading: loadingGenres } = useQuery(GET_COLLECTION, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const { data: nextData, loading: nextLoading, error: nextError } = useQuery(GET_MEDIA, {
        variables: queryVariables.nextSeasonVariables,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    // Memoizowana wartość kontekstu
    const contextValue = useMemo(() => ({
        searchAnime,
        data,
        error,
        loading,
        PopularData,
        PopularLoading,
        PopularError,
        seasonalData,
        seasonalLoading,
        seasonalError,
        allTimeData,
        allTimeLoading,
        allTimeError,
        dataGenres,
        errorGenres,
        loadingGenres,
        nextData,
        nextLoading,
        nextError,
        fetchMore,
        setVisible: handleSetVisible,
        setSelectedKeys: handleSetSelectedKeys,
        selectedKeys,
        nextYear: dateInfo.nextYear,
        season: dateInfo.season,
        seasonYear: dateInfo.seasonYear,
        seasonNext: dateInfo.seasonNext,
        seasonNextYear: dateInfo.seasonNextYear,
        clearTag: parsedKeys.clearTag,
        isVisible,
        sortArray: parsedKeys.sortArray,
        type: parsedKeys.type,
        format: parsedKeys.format,
        statusSearch: parsedKeys.statusSearch,
        countryOfOrigin: parsedKeys.countryOfOrigin,
        genres: parsedKeys.genres,
        year: parsedKeys.year,
        season2: parsedKeys.season2,
    }), [
        searchAnime, data, error, loading,
        PopularData, PopularLoading, PopularError,
        seasonalData, seasonalLoading, seasonalError,
        allTimeData, allTimeLoading, allTimeError,
        dataGenres, errorGenres, loadingGenres,
        nextData, nextLoading, nextError,
        fetchMore, handleSetVisible, handleSetSelectedKeys,
        selectedKeys, dateInfo, parsedKeys, isVisible
    ]);

    console.log(nextData)

    return (
        <BrowseContext.Provider value={contextValue}>
            {children}
        </BrowseContext.Provider>
    );
};

export const useBrowseContext = (): BrowseContextType => {
    const context = useContext(BrowseContext);
    if (!context) {
        throw new Error("useBrowseContext must be used within a BrowseProvider");
    }
    return context;
};
