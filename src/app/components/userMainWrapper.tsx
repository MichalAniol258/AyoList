"use client";
import { createContext, useContext } from "react";
import { useUser } from "./userInfoWrapper";
import { gql, useQuery } from "@apollo/client";

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
  $genresSort3: [UserStatisticsSort],
  $userName: String,
  $mediaListCollectionType2: MediaType
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
        count
        meanScore
        minutesWatched
      }
      manga {
        genres(sort: $genresSort2) {
          count
          genre
        }
        chaptersRead
        count
        meanScore
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
  MediaListCollection(userName: $userName, type: $mediaListCollectionType2) {
    lists {
      entries {
        media {
          chapters
        }
        progress
      }
    }
  }
}
`;


interface UserInfo {
  name: string;
  id: string;
}

interface UserHookReturn {
  userInfo: UserInfo | null;
}

interface UserContextType {
  userData: unknown;
  userError: unknown;
  userLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Wrapper dla kontekstu
export const UserMainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { userInfo } = useUser() as UserHookReturn;



  // Pobranie danych z API GraphQL
  const { data: userData, error: userError, loading: userLoading } = useQuery(GET_MEDIA, {
    variables: {
      name: userInfo?.name,
      mediaListCollectionType2: "MANGA",
      userName: userInfo?.name
    },
    skip: !userInfo,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  if (!userInfo) return null;

  return (
    <UserContext.Provider value={{ userData, userError, userLoading }}>
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
