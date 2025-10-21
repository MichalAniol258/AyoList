"use client";
import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { useUser } from "@/src/app/(main)/components/userInfoWrapper";
import { gql, useQuery } from "@apollo/client";
import React from "react";

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
  $perPage: Int,
  $isMain: Boolean,
  $name: String,
  $genresSort2: [UserStatisticsSort],
  $genresSort3: [UserStatisticsSort]
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
      studios(isMain: $isMain) {
        edges {
          node {
            name
            isAnimationStudio
          }
        }
      }
      status
      season
      seasonYear
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
    pageInfo {
      currentPage
      lastPage
      hasNextPage
    }
  }
  User(name: $name) {
    statistics {
      anime {
        genres(sort: $genresSort3) {
          count
          genre
        }
      }
      manga {
        genres(sort: $genresSort2) {
          count
          genre
        }
      }
    }
    favourites {
      anime {
        nodes {
          title {
            romaji
            english
          }
          coverImage {
            medium
            extraLarge
            large
          }
          startDate {
            year
          }
          format
          id
        }
      }
      manga {
        nodes {
          title {
            romaji
            english
          }
          coverImage {
            medium
            extraLarge
            large
          }
          startDate {
            year
          }
          format
          id
        }
      }
      characters {
        nodes {
          name {
            full
          }
          image {
            large
          }
          id
        }
      }
    }
    stats {
      activityHistory {
        amount
        date
        level
      }
    }
    name
    bannerImage
    avatar {
      large
    }
    about(asHtml: true)
  }
}
`;

// Interfejsy
interface UserInfo {
  name: string;
  id: string;
}

interface UserHookReturn {
  userInfo: UserInfo | null;
}

interface UserContextType {
  userActivityInfo: string | null;
  setUserActivityInfo: (info: string | null) => void;
  userData: unknown;
  userError: unknown;
  userLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userActivityInfo, setUserActivityInfo] = useState<string | null>(null);

  // Pobranie danych użytkownika
  const { userInfo } = useUser() as UserHookReturn;

  // KLUCZOWE: Memoizacja variables żeby uniknąć niepotrzebnych query
  const queryVariables = useMemo(() => ({
    name: userInfo?.name,
    genresSort2: ["COUNT_DESC"],
    genresSort3: ["COUNT_DESC"]
  }), [userInfo?.name]);

  // GraphQL query z optymalizacją
  const { data: userData, error: userError, loading: userLoading } = useQuery(GET_MEDIA, {
    variables: queryVariables,
    skip: !userInfo?.name, // Bardziej specyficzny warunek
    fetchPolicy: 'cache-first', // Zmienione z 'cache-and-network' dla lepszej performance
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false, // Unikaj niepotrzebnych re-renderów
    errorPolicy: 'all', // Nie blokuj UI przy błędach
  });

  // Memoizacja callback'a
  const memoizedSetUserActivityInfo = useCallback((info: string | null) => {
    setUserActivityInfo(info);
  }, []);

  // KLUCZOWE: Memoizacja wartości kontekstu
  const contextValue = useMemo(() => ({
    userActivityInfo,
    setUserActivityInfo: memoizedSetUserActivityInfo,
    userData,
    userError,
    userLoading
  }), [userActivityInfo, memoizedSetUserActivityInfo, userData, userError, userLoading]);

  // Early return jeśli nie ma użytkownika
  if (!userInfo) {
    return (
        <UserContext.Provider value={{
          userActivityInfo: null,
          setUserActivityInfo: () => {},
          userData: null,
          userError: null,
          userLoading: false
        }}>
          {children}
        </UserContext.Provider>
    );
  }

  return (
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
  );
};

// Hook z lepszym error handling
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserActivityProvider");
  }
  return context;
};
