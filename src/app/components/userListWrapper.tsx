"use client";
import { createContext, useContext } from "react";
import { useUser } from "./userInfoWrapper";
import { gql, useQuery } from "@apollo/client";

const GET_MEDIA_PROVIDER = gql`
query ($userId: Int, $type: MediaType, $format: ScoreFormat, $sort: [MediaListSort]) {
  MediaListCollection(userId: $userId, type: $type, sort: $sort) {
    lists {
      name
      entries {
        media {
          id
          title {
            romaji
            english
            native
          }
          format
          genres
          bannerImage
          countryOfOrigin
          coverImage {
            large
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
        }
        status
        progress
        score(format: $format)
        updatedAt
        createdAt
        startedAt {
          month
          year
          day
        }
        completedAt {
          year
          month
          day
        }
        progressVolumes
        notes
        repeat
        mediaId
        id
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
  userListManga: unknown;
  userList: unknown;
  userErrorList: unknown;
  userLoadingList: boolean;
  GET_MEDIA_PROVIDER: unknown;
  refetch: unknown
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Wrapper dla kontekstu
export const UserListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { userInfo } = useUser() as UserHookReturn;

  // Pobranie danych z API GraphQL
  const { data: userList, error: userErrorList, loading: userLoadingList, refetch } = useQuery(GET_MEDIA_PROVIDER, {
    variables: { userId: userInfo?.id, type: "ANIME", sort: undefined },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const { data: userListManga } = useQuery(GET_MEDIA_PROVIDER, {
    variables: { userId: userInfo?.id, type: "MANGA", sort: undefined },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  return (
    <UserContext.Provider value={{ GET_MEDIA_PROVIDER, userListManga, userList, userErrorList, userLoadingList, refetch }}>
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
