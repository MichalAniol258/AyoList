"use client";
import { createContext, useContext, useState } from "react";
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
            extraLarge
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
            extraLarge
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

// Tworzymy interfejsy dla typów danych
interface UserInfo {
  name: string;
  id: string;
}

interface UserHookReturn {
  userInfo: UserInfo | null;
}

interface UserContextType {
  userActivityInfo: string | null;
  setUserActivityInfo: React.Dispatch<React.SetStateAction<string | null>>;
  userData: unknown; // Możesz zamienić na dokładniejszy typ, jeśli chcesz
  userError: unknown;
  userLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Wrapper dla kontekstu
export const UserActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userActivityInfo, setUserActivityInfo] = useState<string | null>(null);

  // Pobranie danych użytkownika z custom hooka `useUserInfo`
  const { userInfo } = useUser() as UserHookReturn;

  // Pobranie danych z API GraphQL
  const { data: userData, error: userError, loading: userLoading } = useQuery(GET_MEDIA, {
    variables: {
      name: userInfo?.name,
      genresSort2: ["COUNT_DESC"],
      genresSort3: ["COUNT_DESC"]
    },
    skip: !userInfo,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  if (!userInfo) return null;

  return (
    <UserContext.Provider value={{ userActivityInfo, setUserActivityInfo, userData, userError, userLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook do używania kontekstu
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
