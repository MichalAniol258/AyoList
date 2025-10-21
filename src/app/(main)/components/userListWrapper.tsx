"use client";
import { createContext, useContext } from "react";
import { useUser } from "./userInfoWrapper";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useMemo } from "react";
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
            medium
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

  // KLUCZOWE: Memoizacja variables dla anime query
  const animeQueryVariables = useMemo(() => ({
    userId: userInfo?.id,
    type: "ANIME",
    sort: undefined
  }), [userInfo?.id]);

  // KLUCZOWE: Memoizacja variables dla manga query
  const mangaQueryVariables = useMemo(() => ({
    userId: userInfo?.id,
    type: "MANGA",
    sort: undefined
  }), [userInfo?.id]);

  // Anime query z optymalizacją
  const {
    data: userList,
    error: userErrorList,
    loading: userLoadingList,
    refetch
  } = useQuery(GET_MEDIA_PROVIDER, {
    variables: animeQueryVariables,
    skip: !userInfo?.id,
    fetchPolicy: 'cache-first', // Zmienione dla lepszej performance
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
    errorPolicy: 'all',
  });

  // Manga query z optymalizacją
  const { data: userListManga } = useQuery(GET_MEDIA_PROVIDER, {
    variables: mangaQueryVariables,
    skip: !userInfo?.id,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
    errorPolicy: 'all',
  });

  // KLUCZOWE: Memoizacja context value
  const contextValue = useMemo(() => ({
    GET_MEDIA_PROVIDER,
    userListManga,
    userList,
    userErrorList,
    userLoadingList,
    refetch
  }), [userListManga, userList, userErrorList, userLoadingList, refetch]);

  // Early return z empty context
  if (!userInfo) {
    return (
        <UserContext.Provider value={{
          GET_MEDIA_PROVIDER,
          userListManga: null,
          userList: null,
          userErrorList: null,
          userLoadingList: false,
          refetch: () => {}
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

// Hook do używania kontekstu - zmieniona nazwa żeby uniknąć konfliktów
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserListContext must be used within a UserListProvider");
  }
  return context;
};
