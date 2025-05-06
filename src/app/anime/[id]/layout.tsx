"use client"
import React, { useEffect, useMemo, useRef, useState } from "react";
import NavPc from "../../navPc";
import Nav from "../../nav.jsx"
import MediaPage from "./mediaPage";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import ISO6391 from 'iso-639-1';
import { motion } from "framer-motion";
import { Tooltip } from "@heroui/tooltip";
import { useMediaQuery } from "@mantine/hooks";
import { Bar, BarChart, LabelList, XAxis } from "recharts"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,

} from "@/components/ui/chart"
import { useUser } from "../../components/userInfoWrapper";
import { usePathname } from "next/navigation";

import { Area, AreaChart, CartesianGrid } from "recharts"
import {
  Card,
  CardContent,

} from "@/components/ui/card"





const chartConfig2 = {
  episode: {
    label: "episode",
  },
  watching: {
    label: "watching",
    color: "hsl(var(--chart-1))",
  },
  score: {
    label: "score",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const chartConfig = {

  score: {
    label: "score",
  },
  amount: {
    label: "amount",
  },
} satisfies ChartConfig

interface PMangalistProps {
  params: { id: number };
  children: React.ReactNode;
}

interface Studio {
  name: string
  isAnimationStudio: boolean
}

interface Tag {
  description?: string;
  name: string;
  rank?: number;
  isMediaSpoiler?: boolean;
}

interface Relation {
  coverImage?: { large: string; extraLarge: string; medium: string }
  source: string;
  id: number

}

interface Edges {
  id: number
  node: {
    coverImage?: { large: string; extraLarge: string; medium: string }
    source: string;
    id: number
    format: string;
    title: { romaji: string; english: string; native: string };
    status: string;
    type: string;
  }
  relationType: string
}

interface voiceActors {
  name: { full: string }
  image: { large: string }
  languageV2: string
}

interface EdgesCharacter {
  role: string;
  name: string;
  voiceActors: voiceActors[]
  node: { name: { full: string; }; image: { large: string } }
}

interface EdgesStaff {
  role: string;
  node: { name: { full: string }; image: { large: string } }
}

interface StreamingEpisodes {
  url: string;
  title: string;
  thumbnail: string
}

interface StatusDistribution {
  status: string;
  amount: number;
}

interface ScoreDistribution {
  amount: number;
  score: number;
}

interface recommendEdges {
  node: { mediaRecommendation: { title: { english: string; romaji: string }; coverImage: { extraLarge: string }; id: number } }
}


interface Media {
  title: { romaji: string; english: string; native: string };
  rankings: { rank: number; context: string, year: number }[];
  nextAiringEpisode?: { timeUntilAiring: number; episode: number };
  status?: string;
  duration?: number;
  startDate?: { day: number; month: number; year: number };
  season?: string;
  seasonYear?: number;
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  favourites: number;
  relations?: { nodes: Relation[], edges: Edges[] };
  tags: Tag[];
  hashtag?: string
  genres?: [];
  recommendations: { edges: recommendEdges[] }
  description: string;
  streamingEpisodes: StreamingEpisodes[]
  staff: { edges: EdgesStaff[] }
  synonyms: [];
  stats: { statusDistribution: StatusDistribution[]; scoreDistribution: ScoreDistribution[] }
  format?: string;
  characters?: { edges: EdgesCharacter[]; pageInfo: { hasNextPage: boolean; currentPage: number } }
  externalLinks: { url: string; site: string; language: string; color: string; icon: string; }[];
  source?: string
  studios: { nodes: Studio[] };
}







const MEDIA_INFO = gql`
  query Query($mediaId: Int, $isMain: Boolean, $version: Int, $sort: [CharacterSort], $role: CharacterRole, $staffSort2: [StaffSort], $recommendationsSort2: [RecommendationSort], $mediaListCollectionUserId2: Int, $type: MediaType, $userId: Int!, $page: Int, $perPage: Int, $language: StaffLanguage, $recommendationsPerPage2: Int, $recommendationsPage2: Int, $staffPage2: Int, $staffPerPage2: Int) {
    Media(id: $mediaId) {
      title {
        romaji
        english
        native
      }
      tags {
        description
        name
        rank
        isMediaSpoiler
        isGeneralSpoiler
      }
      volumes
      status
      type
      synonyms
      startDate {
        year
        month
        day
      }
      averageScore
      chapters
      countryOfOrigin
      endDate {
        year
        month
        day
      }
      meanScore
      popularity
      description
      rankings {
        season
        rank
        format
        allTime
        year
        type
        context
      }
      season
      seasonYear
      genres
      favourites
      externalLinks {
        color
        icon
        notes
        site
        type
        url
        siteId
        language
        isDisabled
        id
      }
      nextAiringEpisode {
        timeUntilAiring
        episode
        airingAt
      }
      duration
      studios(isMain: $isMain) {
        nodes {
          name
          isAnimationStudio
        }
      }
      format
      source
      hashtag
      relations {
        nodes {
          title {
            romaji
            native
            english
            userPreferred
          }
          type
          volumes
          source
          format
          coverImage {
            large
            extraLarge
            color
            medium
          }
          status
          id
          siteUrl
        }
        edges {
          relationType(version: $version)
          id
          node {
            title {
            romaji
            native
            english
            userPreferred
          }
          type
          volumes
          source
          format
          coverImage {
            large
            extraLarge
            color
            medium
          }
          status
          id
          siteUrl
          }
        }
      }
      characters(sort: $sort, role: $role, page: $page, perPage: $perPage) {
        edges {
          role
          name
          node {
            image {
              large
              medium
            }
            name {
              full
              alternative
              alternativeSpoiler
              first
              last
              middle
              native
              userPreferred
            }
            id
          }
          voiceActors(language: $language) {
            name {
              first
              alternative
              full
              last
              middle
              native
              userPreferred
            }
            image {
              large
              medium
            }
            languageV2
          }
        }
        pageInfo {
          hasNextPage
          currentPage
        }
      }
      staff(sort: $staffSort2, page: $staffPage2, perPage: $staffPerPage2) {
        edges {
          role
          node {
            name {
              full
            }
            image {
              large
              medium
            }
            id
          }
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
      streamingEpisodes {
        url
        title
        thumbnail
      }
      stats {
        statusDistribution {
          status
          amount
        }
        scoreDistribution {
          score
          amount
        }
      }
      recommendations(sort: $recommendationsSort2, perPage: $recommendationsPerPage2, page: $recommendationsPage2) {
        edges {
          node {
            mediaRecommendation {
              title {
                userPreferred
                romaji
                native
                english
              }
              coverImage {
                extraLarge
                large
                medium
                color
              }
              id
            }
            id
          }
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
      id
      idMal
    }
    MediaListCollection(userId: $mediaListCollectionUserId2, type: $type) {
      lists {
        entries {
          status
          user {
            name
            avatar {
              large
            }
          }
          mediaId
          score
        }
      }
    }
    Following(userId: $userId) {
      id
      name
    }
  }`

const MediaTrend = gql`
query MediaTrend($mediaId: Int) {
  MediaTrend(mediaId: $mediaId, sort: EPISODE_DESC) {
    media {
      stats {
        airingProgression {
          episode
          score
          watching
        }
      }
    }
    date
    releasing
    inProgress
    episode
    mediaId
    popularity
    trending
    averageScore
  }
}

`;


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






interface MediaList {
  entries?: MediaListEntry[];
}

interface AiringProgression {
  episode: number;
  score: number;
  watching: number;
}

interface MediaTrend {
  media: { stats: { airingProgression: AiringProgression[] } };
}
interface MediaListEntry {
  mediaId: number;
  score: number;
  status: string;
  user?: MediaUser;
}

interface MediaUser {
  name?: string;
  avatar?: MediaAvatar;
}

interface MediaAvatar {
  large?: string;
}



export default function PMangalist({ params: { id }, children }: PMangalistProps) {




  const { userInfo } = useUser();
  const isClass = useMediaQuery("(min-width: 1040px)");
  const isClassMobile = useMediaQuery("(max-width: 768px)");
  const isClass2 = useMediaQuery("(min-width: 1540px)");
  const [isLoading, setLoading] = useState(false);
  const [isLoading2, setLoading2] = useState(false);
  const [isLoading3, setLoading3] = useState(false);
  const [isSpoiler, setSpoiler] = useState(false);
  const [isToggle, setToggle] = useState(false);
  const pathname = usePathname() || '/';
  const endOfListRef = useRef<HTMLDivElement>(null);
  const endOfListRef2 = useRef<HTMLDivElement>(null);
  const endOfListRef3 = useRef<HTMLDivElement>(null);

  const [selectedKeys, setSelectedKeys] = useState({
    languages: new Set(["JAPANESE"]),
  });


  const languages = [
    { name: 'Japanese', key: 'JAPANESE' },
    { name: 'English', key: 'ENGLISH' },
    { name: 'Korean', key: 'KOREAN' },
    { name: 'Italian', key: 'ITALIAN' },
    { name: 'Spanish', key: 'SPANISH' },
    { name: 'Portuguese', key: 'PORTUGUESE' },
    { name: 'French', key: 'FRENCH' },
    { name: 'German', key: 'GERMAN' },
    { name: 'Hebrew', key: 'HEBREW' },
    { name: 'Hungarian', key: 'HUNGARIAN' }
  ];

  const selectedValue = useMemo(() => {
    const languages = selectedKeys.languages ?? []; // Jeśli null lub undefined, użyj pustej tablicy

    const language = Array.from(languages)
      .filter(country => country !== "")
      .map((country) => country.replaceAll("_ ", " "));

    return language.join(", ");
  }, [selectedKeys.languages]);



  const formatedLanguage = selectedValue
    ?.toLowerCase()
    .replace(/_/g, ' ') // Zamiana "_" na spację
    .replace(/\b\w/g, char => char.toUpperCase());

  const handleSelectionChange = (key: string, newSelectedKeys: Set<string>) => {
    setSelectedKeys((prev) => {
      if (newSelectedKeys.size === 0) return prev;

      return {
        ...prev,
        [key]: newSelectedKeys,
      };
    });
  };










  const { data: userList2, loading: userLoading2 } = useQuery(MEDIA_INFO, {
    variables: {
      mediaId: id, language: "JAPANESE", userId: userInfo?.id, mediaListCollectionUserId2: userInfo?.id, type: "ANIME", isMain: true, version: 2, role: undefined, sort: "ID", staffSort2: "RELEVANCE", recommendationsSort2: 'RATING_DESC',

    }
  });



  const { data: userList, loading: userLoading, error: errorLoading, fetchMore } = useQuery(MEDIA_INFO, {
    variables: {
      page: 1,
      perPage: 20,
      recommendationsPage2: 1,
      recommendationsPerPage2: 20,
      staffPage2: 1,
      staffPerPage2: 20, mediaId: id, language: selectedValue, userId: userInfo?.id, mediaTrendMediaId2: id, mediaListCollectionUserId2: userList2?.Following?.id, type: "ANIME", isMain: true, version: 2, role: undefined, sort: "ID", staffSort2: "RELEVANCE", recommendationsSort2: 'RATING_DESC',

    }
  });


  const { data: userTrend } = useQuery(MediaTrend, {
    variables: {
      mediaId: id
    }
  });

  const { loading: loadingMedia, data: mediaData } = useQuery(GET_ANIME_DETAILS, {
    variables: { mediaId: id },
  });
  const { data: user, loading: userLoading3 } = useQuery(MEDIA_INFO, {
    variables: { mediaId: id, isMain: false, version: 2 }
  });

  const loadMoreRecommendations = () => {
    if (!userLoading && userList?.Media?.recommendations?.pageInfo?.hasNextPage) {
      setLoading2(true);

      fetchMore({
        variables: { recommendationsPage2: userList.Media.recommendations.pageInfo.currentPage + 1 },

        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;

          const previousEdges: Edge[] = previousResult?.Media?.recommendations?.edges || [];
          const newEdges: Edge[] = fetchMoreResult?.Media?.recommendations?.edges || [];

          type Edge = { node: { id: number } };

          const mergedEdges = [
            ...previousEdges,
            ...newEdges.filter(newItem => !previousEdges.some(oldItem => oldItem?.node?.id === newItem?.node?.id))
          ]

          return {
            ...previousResult,
            Media: {
              ...previousResult.Media,
              recommendations: {
                ...fetchMoreResult.Media.recommendations,
                edges: mergedEdges
              }
            }
          }
        }
      }).catch((error) => {
        console.error("Błąd ładowania postaci:", error);
      }).finally(() => {
        setLoading2(false)
      })
    }
  }


  const loadMoreStaff = () => {
    if (!userLoading && userList?.Media?.staff?.pageInfo?.hasNextPage) {
      setLoading3(true);
    }

    fetchMore({
      variables: { staffPage2: userList.Media.staff.pageInfo.currentPage + 1 },

      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;

        type Edge = { node: { id: number } }

        const previousEdges: Edge[] = previousResult?.Media?.staff?.edges || [];
        const newEdges: Edge[] = fetchMoreResult?.Media?.staff?.edges || [];

        const mergedEdges = [
          ...previousEdges,
          ...newEdges.filter(newItem =>
            !previousEdges.some(oldItem => oldItem?.node?.id === newItem?.node.id)
          )
        ];

        return {
          ...previousResult,
          Media: {
            ...previousResult.Media,
            staff: {
              ...fetchMoreResult.Media.staff,
              edges: mergedEdges
            }
          }
        }
      }
    }).catch((error) => {
      console.error("Błąd ładowania postaci:", error);
    }).finally(() => {
      setLoading3(false);
    });
  }








  const loadMore = () => {
    if (!userLoading && userList?.Media?.characters?.pageInfo?.hasNextPage) {
      setLoading(true);

      fetchMore({
        variables: { page: userList.Media.characters.pageInfo.currentPage + 1 },

        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;



          type Edge = { node: { id: number } };

          const previousEdges: Edge[] = previousResult?.Media?.characters?.edges || [];
          const newEdges: Edge[] = fetchMoreResult?.Media?.characters?.edges || [];




          const mergedEdges = [
            ...previousEdges,
            ...newEdges.filter(newItem =>
              !previousEdges.some(oldItem => oldItem?.node?.id === newItem?.node?.id)
            ),
          ];

          return {
            ...previousResult,
            Media: {
              ...previousResult.Media,
              characters: {
                ...fetchMoreResult.Media.characters,
                edges: mergedEdges,
              },
            },
          };
        }
      })
        .catch((error) => {
          console.error("Błąd ładowania postaci:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {

          loadMore();
        }
      },
      { root: null, rootMargin: "100px", threshold: 1.0 }
    );

    if (endOfListRef.current && pathname.includes("/characters")) {
      observer.observe(endOfListRef.current);
    }

    return () => {
      if (endOfListRef.current && pathname.includes("/characters")) {
        observer.unobserve(endOfListRef.current);
      }
    };
  }, [userList, userLoading, pathname]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {

          loadMoreStaff()
        }
      },
      { root: null, rootMargin: "100px", threshold: 1.0 }
    );

    if (endOfListRef3.current && pathname.includes("/staff")) {
      observer.observe(endOfListRef3.current);
    }

    return () => {
      if (endOfListRef3.current && pathname.includes("/staff")) {
        observer.unobserve(endOfListRef3.current);
      }
    };
  }, [userList, userLoading, pathname]);


  useEffect(() => {
    if (!endOfListRef2.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {

          loadMoreRecommendations();
        }
      },
      { root: null, rootMargin: "100px", threshold: 1.0 }
    );

    observer.observe(endOfListRef2.current);

    return () => {
      observer.disconnect();
    };
  }, [userList, userLoading, loadMoreRecommendations]);






  if (userLoading || userLoading2 || userLoading3 || loadingMedia) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-1 flex justify-center items-center">
          <div className="rotating"><div className="rotating-text">
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠂⠠⣦⢶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⠤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⡧⠯⠁⠘⣽⡿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡟⠠⢶⣶⣿⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡛⣩⣵⡂⠀⢐⡒⡆⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠨⣵⣻⣧⣽⣳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⢸⡿⣞⡿⣋⡄⠀⠀⢭⣑⢻⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡇⠀⠀⠔⠫⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣸⣾⣧⣶⠟⡋⣀⡀⠀⢀⣀⣯⢎⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷⠀⠀⠠⢶⣶⣞⣻⢿⣾⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣈⣾⣫⣿⣽⣶⣯⣟⡶⠄⠀⠀⠲⠄⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡆⠀⣴⣓⠚⠛⣿⣿⣿⣾⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⡿⠟⠉⠁⠀⠀⠀⠂⡧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡀⠉⠉⠉⣳⣿⣶⣿⣿⣿⣿⣿⣿⣿⣷⡶⣴⣴⣶⡛⠛⠉⠉⠉⠉⠉⠀⢠⠛⠛⢿⣟⣯⣷⣾⣿⣿⣿⣿⣿⣿⣟⣛⣭⡴⠄⠀⠀⠀⠀⠈⠆⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡧⠀⠀⠈⢉⣉⣿⣿⣿⣿⣿⠿⣛⣿⡿⠀⠀⠀⠻⢿⣦⢀⣀⡀⠀⠀⣤⣇⣀⣼⡞⠈⠉⠉⠉⣀⠉⠛⠻⢿⣿⣿⣟⠓⣦⠔⠀⠀⠀⠀⠀⠨⡕⠅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣇⠀⣤⣬⣿⣿⠟⠛⠉⠁⠀⠘⣿⣿⠇⠀⠀⠑⠀⠘⠿⠟⠛⠙⠦⡞⠉⠛⠾⠃⠀⠀⠀⠀⠀⢿⣿⣧⠀⠀⠀⠈⠙⢷⣶⣼⡒⠓⠂⠀⢀⠀⠍⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣾⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠘⠿⠀⠀⣀⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠾⡿⠉⠀⠀⠀⠀⠀⠀⠙⠿⣿⣶⡄⠀⢸⡇⡆⠀⠐⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠏⠉⢀⣰⣷⡿⠷⣾⣶⣶⣤⣀⠀⠀⠀⠀⠹⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⠈⠀⠀⠀⠁⣀⣤⣶⣾⣽⣿⣷⣤⣄⠀⠉⠛⣧⣿⠽⡀⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡾⠥⠤⠴⣾⡿⠃⢠⣾⣿⡟⠉⠉⣻⡗⢄⠀⠀⠀⠈⠣⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠁⠀⠀⡴⡏⠎⢿⣿⠋⠐⢿⣿⣏⠈⢹⣦⠀⠀⠀⢹⡙⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⢏⠀⠀⠀⠀⢿⣇⠀⢸⣿⣿⣧⣀⣰⣿⡇⠀⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⡈⡇⠀⡀⢸⣦⣤⡀⣼⣿⢿⠀⠀⢀⠈⠁⠀⠣⣄⠘⣳⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠃⠀⠁⠄⡀⠀⠀⠛⠦⠌⠿⠿⢿⠿⠿⠋⣠⣾⣿⡀⢀⡤⠖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⢸⣿⣄⡀⠈⠻⢿⢿⠿⡿⠁⣀⡸⠃⠀⠀⠀⣠⠀⠻⢮⢥⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠁⠀⠀⠀⠀⠀⠀⠃⠰⠠⢄⡀⠀⠀⠀⠀⠀⠀⠀⣨⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠿⣷⣜⠋⠉⠉⠉⠉⠓⠀⠐⠀⠈⠈⠄⠀⡄⠐⠈⠁⠁⠀⡁⠂⠁⠘⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠐⠒⠠⢀⠠⢺⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⣦⡀⠀⠄⠀⠤⠀⠀⠐⠀⠉⠀⠀⠀⠀⠀⠀⠀⠄⠀⠀⢀⢀⡑⠝⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡏⠀⣠⣤⣠⣀⡀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠀⠀⠀⠀⣀⣤⣤⣤⣦⣤⣤⣤⣤⣤⣤⣤⣤⣀⠀⠀⠀⠀⠙⠛⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠀⢰⣄⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⢈⣭⣿⠷⠚⠛⠙⢹⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢿⣿⣿⣿⣿⣿⣽⣿⣻⣟⣿⣽⣻⣟⣿⡷⠀⠀⠀⠀⠀⠐⢡⢀⠀⠀⠀⠀⠀⢀⣶⣴⣦⣤⣤⣄⡀⠀⢀⣶⡧⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣧⠀⠀⠈⠁⠀⠀⠀⠀⢸⣿⡆⠀⠀⠶⠆⢾⠃⠀⠷⠀⠀⠀⠀⠀⠈⠉⠉⢿⣟⣿⣿⣽⣿⡾⣿⡅⠀⠀⠀⠀⠀⠀⠀⢠⡄⢠⢯⠐⣀⠀⢀⣀⡈⠉⠉⠙⠙⠛⠛⠳⢚⡾⣽⡋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⢀⡀⢠⣶⠀⣴⡄⠀⠀⠀⠀⠀⠀⠀⠙⢯⣿⣾⣿⣏⡿⠃⠀⠀⠀⠀⠀⠀⠀⠠⣄⠠⣠⣀⡀⡈⠉⠉⠀⠀⠀⠀⠀⠀⢀⣤⡖⣿⠁⠴⣾⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢧⠀⠀⠀⠀⠀⠀⠀⠀⠹⠃⠀⠀⠀⡀⠀⢀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠉⠐⠀⠀⠀⠀⢠⡴⠞⠋⠁⠀⠀⠀⣠⢂⣥⠡⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⣤⣤⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣧⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠀⠈⠈⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠤⢈⡋⠉⠁⠀⠀⠚⠄⠌⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠏⠡⢺⡿⠏⠀⠀⡠⠀⠀⠀⠀⠀⠀⠐⠒⠠⠤⠄⠠⠤⠤⠤⠴⠒⠚⠉⠉⠉⠉⠉⠉⠓⠲⠤⢤⣀⣀⡀⣀⠤⠒⡖⠊⠩⠉⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠀⠀⠁⢴⡃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠏⠀⠀⠼⣅⠀⠀⢩⢶⣿⣿⣿⣶⠶⠚⠀⠀⠀⠀⠀⠐⠤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⡄⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⡑⠘⡮⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠏⠀⠀⢠⠎⠁⠀⠀⠀⠈⠉⠁⠉⠉⠟⠋⠽⢴⣂⣥⣀⣀⣀⣈⡉⢒⡶⠦⣀⣀⣀⣠⣀⣀⣀⣤⣴⣶⠿⠛⠁⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢬⣿⣡⣗⡅⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡏⠀⠀⠀⠀⠀⢡⠔⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁⠉⠉⠉⠀⠀⠀⠉⠉⠉⡍⠉⠉⢉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⣹⣿⣿⣖⣹⠨⣏⡐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⠀⠀⠀⠀⢰⠃⠤⠊⢠⠴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⠀⠀⢸⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⣄⣤⣄⣹⣿⠛⡓⠂⠀⠙⠀⢻⠬⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣤⠄⠀⠀⠀⠀⣴⠈⠛⢻⢛⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⠞⠀⠀⠀⠈⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⠀⠀⠀⠀⠀⠤⣄⣷⣬⣙⡛⠛⠉⠀⠀⠀⠀⣒⡰⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠃⢼⣿⡇⠀⠀⠀⠀⠈⠁⠀⠟⠉⢩⣭⢉⣠⢀⡤⠀⠀⠀⠀⠀⠀⠀⢀⣾⠇⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣔⢆⢸⡀⠀⢀⣰⣠⡿⠒⠂⠈⠀⠁⠀⠀⠀⢀⠈⢠⣳⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡄⠀⠿⢟⡿⣶⡀⠀⠀⠀⠀⠀⠀⠸⠋⠡⣰⢿⣧⣞⣡⣾⣀⣄⣤⡾⠋⠈⠀⠀⠀⠀⠀⠀⠀⠀⢳⡈⢿⣆⣠⣀⢠⢀⡀⢠⣬⣏⣳⣬⠿⠛⠃⠈⠉⠀⠀⠀⠀⠀⠀⠀⠀⡰⣟⣿⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡀⠀⠈⣼⠥⣿⣧⣶⣾⣀⡀⠀⠀⠀⠀⠁⠘⠁⠐⠛⠁⠘⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⠉⠉⠛⠿⠿⠟⢻⣿⠉⠛⠙⠒⠒⠀⠀⠀⠀⠀⠀⠀⠀⢈⣷⣾⣾⣧⣎⡯⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡇⢰⣀⠀⢠⠿⣿⣿⣿⣼⣧⣾⢀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠐⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣝⠒⢶⣿⡿⢿⡏⠁⠼⠁⡋⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣷⡼⣿⣄⠀⠀⠀⢨⠿⢻⣿⣿⣧⣾⣷⣏⣡⢀⣠⣷⣖⣴⣶⣶⣾⠤⢀⣤⣴⡾⠁⠀⠀⠘⣿⡷⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⢰⣶⣀⠰⣿⣷⣾⠏⠉⠀⠸⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⢻⠿⠇⡀⠀⠀⠀⠘⠈⠁⠀⡽⠛⠟⠋⣵⣾⡿⠿⠛⡿⠋⠁⡰⢫⢯⢿⠁⠀⠀⠀⠀⠘⠳⣽⣿⣦⢀⣞⣤⡀⠹⣤⣦⠀⡀⢴⢠⠀⢳⣿⣭⣛⠻⠏⠉⠉⠀⠀⠀⡨⢸⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣟⣾⣿⣷⣿⣧⡄⠀⠀⠀⠀⠀⠀⠀⠀⠒⠚⠉⠀⠀⠈⠀⠀⠊⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠻⣿⢿⡿⣿⡦⣼⣿⡳⣽⣽⣷⠷⢬⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⢀⡨⣠⠴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⢩⣯⣼⣿⣿⡿⠻⡜⣦⣠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⠀⠀⠀⠈⠙⠋⠉⠉⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⢀⠐⣤⣼⣿⢩⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡇⣾⣽⣿⣿⢟⣵⢿⡇⣻⡿⣇⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠲⣤⣀⠀⠀⠀⠀⠀⠀⠀⢠⣠⢤⡀⠀⠤⠀⠀⠐⠀⠐⡐⣤⣿⣂⣿⠿⣷⠿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣻⢿⣿⢯⣾⣿⣿⣷⣿⢗⡙⢃⣷⣾⠀⡆⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠇⠀⠑⠆⠀⠀⠀⠀⠲⠌⠉⠁⠁⠀⠀⢠⡀⢤⣐⣈⣿⣿⣿⣿⣿⣿⣿⠦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣳⢯⣿⣿⢏⣾⣿⣿⣿⣾⣼⡿⠁⡿⠏⢻⡸⣇⣶⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢤⣀⣀⣀⠀⣐⣶⣾⣹⣯⣷⣚⠿⣷⣿⣿⣿⣿⡟⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⣾⣿⣿⣿⣿⣿⣿⣿⣿⡟⣁⣼⠟⣐⣬⡷⣠⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢰⣤⣴⣶⣶⠾⣷⣦⣽⡿⢩⣌⠻⣿⣷⣯⣟⡿⣿⣿⣿⣿⣿⣿⠇⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡟⢀⣼⣿⣿⣿⣿⣿⣿⡿⣋⣴⠟⣡⣶⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠿⣿⣷⣹⣿⡷⣿⣦⣻⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⡿⡏⣯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢘⡇⠸⣿⢋⣿⠟⠋⢁⡿⢠⠛⠠⠌⠉⣿⡿⣿⣿⡿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣷⢿⣿⣿⣿⣿⡟⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢷⣧⣼⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
          </div>
          </div>
        </div>
      </div>
    );
  }
















  const MediaListCollection: MediaList[] = userList?.MediaListCollection?.lists || [];

  const MediaListEntries: MediaListEntry[] = MediaListCollection.flatMap((list) => list.entries || []);



  const filteredMediaIds = MediaListEntries
    .filter((item) => item.mediaId === Number(id))
    .map((item) => ({
      score: item.score,
      status: item.status,
      userName: item.user?.name,
      userAvatar: item.user?.avatar?.large
    }));


  const media: Media = userList?.Media || [];
  const media3: Media = userList2?.Media || [];


  const media2: Media = user?.Media || [];



  const time = media.nextAiringEpisode?.timeUntilAiring || 0;
  const days = Math.floor((time / 86400))
  const hours = Math.floor((time % 86400) / 3600)
  const minutes = Math.floor((time % 3600 / 60))



  let kolorek1 = '';
  const mediaTrend: MediaTrend = userTrend?.MediaTrend || [];

  // Pobranie poprawnej tablicy airingProgression
  const airingProgression: AiringProgression[] =
    mediaTrend?.media?.stats?.airingProgression || [];

  // Mapowanie poprawnej tablicy
  const chartData3 = airingProgression.map((item) => ({
    episode: item.episode,
    score: item.score,
    watching: item.watching,
  }));





  const chartData = media.stats?.scoreDistribution.map((item) => {
    if (item.score <= 10) {
      kolorek1 = '#d44f2a'
    } else if (item.score <= 20) {
      kolorek1 = '#de6a3d'
    } else if (item.score <= 30) {
      kolorek1 = '#e58755'
    } else if (item.score <= 40) {
      kolorek1 = "#eaa572"
    } else if (item.score <= 50) {
      kolorek1 = '#edc392'
    } else if (item.score <= 60) {
      kolorek1 = "#e4dba6"
    } else if (item.score <= 70) {
      kolorek1 = "#b7d59e"
    } else if (item.score <= 80) {
      kolorek1 = "#7cce93"
    } else if (item.score <= 90) {
      kolorek1 = "#41c586"
    } else if (item.score <= 100) {
      kolorek1 = "#00bc80"
    }

    return (
      ({
        score: item.score,
        amount: item.amount,
        fill: kolorek1
      })
    )

  });






  const toggleSpoiler = (item: boolean) => {
    setSpoiler(!item)
  }

  const getMonthName = (month?: number) => {
    if (!month) return "";
    return new Intl.DateTimeFormat("en-EN", { month: "short" }).format(new Date(2021, month - 1));
  };





  const countSpoilerTags = media.tags?.filter((entry) => {
    return (
      entry.isMediaSpoiler === true
    )
  }).map((item) => {
    const amounth = item.name

    return amounth.length
  })


  const color = [
    `rgb(104, 214, 57)`, `rgb(2, 169, 255)`, `rgb(146, 86, 243)`, `rgb(247, 121, 164)`, `rgb(232, 93, 117)`, `rgb(247, 154, 99)`
  ]



  const monthName = getMonthName(media.startDate?.month);
  return (
    <>
      <NavPc />
      <MediaPage
          mediaId={id}
          mediaLoading={loadingMedia}
          mediaData={mediaData}
      />
      { (<> <div className="contentContainer content-layout">
        {!errorLoading && <div className="sidebar">
          {media.rankings?.length > 0 && <div className="rankings">
            <Link className="ranking rated" href={'#'}>
              <svg data-v-a6e466b2="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="media-svg2"><path data-v-a6e466b2="" fill="rgb(247, 191, 99)" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>
              <span className="rank-text">#{media.rankings?.[0]?.rank} {media.rankings?.[0]?.context}</span>
            </Link>
            <Link className="ranking popular" href={'#'}>
              <svg data-v-a6e466b2="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="media-svg2"><path data-v-a6e466b2="" fill="rgb(232, 93, 117)" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>
              <span className="rank-text">#{media.rankings?.[1]?.rank} {media.rankings?.[1]?.context} {media.rankings?.[1]?.year}</span>
            </Link>
          </div>}
          <div className="data">
            {media.nextAiringEpisode?.timeUntilAiring && <div className="data-set airing-countdown">
              <div className="type-media">
                Airing
              </div>
              <div className="value-media">Ep {media.nextAiringEpisode?.episode}: {days}d {hours}h {minutes}m</div>

            </div>}
            {media.format && <div className="data-set">
              <div className="type-media">Format</div>
              <div className="value-media">{media.format}</div>
            </div>}

            {media.duration && <div className="data-set">
              <div className="type-media">Episode Duration</div>
              <div className="value-media">{media.duration}m</div>
            </div>}

            {media.startDate && <div className="data-set">
              <div className="type-media">Start Date</div>
              <div className="value-media">{monthName} {media.startDate?.day}, {media.startDate?.year}</div>
            </div>}


            {media.season && media.seasonYear && <div className="data-set">
              <div className="type-media">Season</div>
              <div className="value-media">{media.season} {media.seasonYear}</div>
            </div>}

            {media.averageScore && <div className="data-set">
              <div className="type-media">Average Score</div>
              <div className="value-media">{media.averageScore}%</div>
            </div>
            }
            {media.averageScore && <div className="data-set">
              <div className="type-media">Mean Score</div>
              <div className="value-media">{media.meanScore}%</div>
            </div>
            }
            {media.popularity && <div className="data-set">
              <div className="type-media">Popularity</div>
              <div className="value-media">{media.popularity}</div>
            </div>}

            {media.favourites > 0 && <div className="data-set">
              <div className="type-media">Favorites</div>
              <div className="value-media">{media.favourites}</div>
            </div>}

            {media?.studios?.nodes.length > 0 && <div className="data-set">
              <div className="type-media">Studios</div>
              <div className="value-media">{media.studios?.nodes.map((item) => (
                  item.name
              ))}</div>
            </div>}

            {media2.studios?.nodes.length > 0 && <div className="data-set">
              <div className="type-media">Producers</div>
              <div className="value-media">{media2.studios?.nodes.map((item, index) => (
                  <span key={index}>{item.name}<br /></span>
              ))}</div>
            </div>}

            {media.source && <div className="data-set">
              <div className="type-media">Source</div>
              <div className="value-media">{media.source}</div>
            </div>}

            {media.hashtag && <div className="data-set">
              <div className="type-media">Hashtag</div>
              <div className="value-media">{media.hashtag}</div>
            </div>}

            {media.genres && <div className="data-set">
              <div className="type-media">Genres</div>
              <div className="value-media">{media.genres?.map((item, index) => (
                  <span key={index}>{item} <br /></span>
              ))}</div>
            </div>}

            {media.title?.romaji && <div className="data-set">
              <div className="type-media">Romaji</div>
              <div className="value-media">{media.title?.romaji}</div>
            </div>}

            {media.title?.english && <div className="data-set">
              <div className="type-media">English</div>
              <div className="value-media">{media.title?.english}</div>
            </div>}

            {media.title?.native && <div className="data-set">
              <div className="type-media">Native</div>
              <div className="value-media">{media.title?.native}</div>
            </div>}

            {media.synonyms?.length > 0 && <div className="data-set">
              <div className="type-media">Synonyms</div>
              <div className="value-media">{media.synonyms?.map((item, index) => (
                  <span key={index}>{item} <br /></span>
              ))}</div>
            </div>}
          </div>
          {media.tags?.length > 0 && <div className="tags">
            <h2>Tags</h2>
            {media.tags
                ?.filter((entry) => !entry.isMediaSpoiler || isSpoiler) // Jeśli isSpoiler == true, pokazuje oba rodzaje tagów
                .map((item, index) => (
                    <div className={`tag ${item.isMediaSpoiler ? 'spoiler' : ''}`} key={index}>
                      <Link aria-label={item.description} className="tooltipLink" href={'#'}>{item.name}</Link>
                      <div className="rank">{item.rank}%</div>
                    </div>
                ))}

            <div className="spoiler-toggle" onClick={() => toggleSpoiler(isSpoiler)}>
              {isSpoiler ? `Hide ${countSpoilerTags?.length} spoiler tags` : `Show ${countSpoilerTags?.length} spoiler tags`}
            </div>



          </div>}
          <div className="review button"></div>
          <div className="review button exit"></div>

          {media.externalLinks?.length > 0 && <div className="external-links">
            <h2>External & Streaming links</h2>
            <div className="external-links-wrap">
              {media.externalLinks?.map((item, index) => {
                const language = item.language ? item.language.toLowerCase() : '';
                const languageCode = ISO6391.getCode(language);


                return (
                    <motion.a
                        key={index}
                        className="external-link"
                        href={`${item.url}`}
                        style={{ color: item.color }} // Domyślny kolor
                        whileHover={{
                          backgroundColor: item.color, // Zmiana koloru tła
                        }}
                        transition={{ duration: 0.1 }}
                    >
                      <div className="icon-wrap" style={{
                        backgroundColor: `${item.color}`
                      }}>

                        {!item.icon ? <svg data-v-c1b7ee7c="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="link" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon-media2"><path data-v-c1b7ee7c="" fill="currentColor" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path></svg>
                            : <img src={`${item.icon}`} alt="" className="icon" />}
                      </div>
                      <span className="name">
                      {item.site}
                        <span className="language"> {languageCode.toUpperCase() || item.language}</span>
                    </span>
                    </motion.a>
                )
              })}

            </div>
          </div>}


        </div>}
        <div className="Overview">
          {pathname === `/anime/${id}` && media.relations?.edges && <>    <div className='description-wrap'>
            <h2>Description</h2>
            <p className="description content-wrap" dangerouslySetInnerHTML={{ __html: media.description }} />
          </div>
            <div className={`relations ${isClass && 'Small'}`}>
              <h2>Relations</h2>
              <div className={`${!isClass && 'grid-wrap'}`}>
                {media.relations?.edges
                    ?.slice() // Tworzymy kopię, żeby nie modyfikować oryginalnych danych
                    .sort((a, b) => {
                      const priorityOrder = ["ADAPTATION", "SOURCE", "PREQUEL", "SEQUEL", "ALTERNATIVE", "PARENT", "SIDE_STORY", "CHARACTER", "SUMMARY", "SPIN_OFF", "OTHER"];

                      const indexA = priorityOrder.indexOf(a.relationType) !== -1 ? priorityOrder.indexOf(a.relationType) : priorityOrder.length;
                      const indexB = priorityOrder.indexOf(b.relationType) !== -1 ? priorityOrder.indexOf(b.relationType) : priorityOrder.length;

                      return indexA - indexB; // Sortowanie według indeksów w priorityOrder
                    })
                    .map((edge, index) => {
                      const item = edge.node;

                      const formattedRelation = edge.relationType
                          ?.toLowerCase()
                          .replace(/_/g, ' ') // Zamiana "_" na spację
                          .replace(/\b\w/g, char => char.toUpperCase());




                      const formattedStatus = item.status
                          ?.toLowerCase()
                          .replace(/_/g, ' ') // Zamiana "_" na spację
                          .replace(/\b\w/g, char => char.toUpperCase());

                      const formattedFormat = item.format
                          ?.toLowerCase()
                          .replace(/_/g, ' ') // Zamiana "_" na spację
                          .replace(/\b\w/g, char => char.toUpperCase()) // Zamiana pierwszej litery każdego słowa na wielką
                          .replace(/\b(Tv|Ova|Ona)\b/gi, match => match.toUpperCase());


                      const typeMedia = item.type === 'ANIME' ? '/anime/' : '/manga/'

                      return (
                          <div key={index} className={`media-preview-card ${isClass && 'Small'}`}>
                            <Link className="coverRelations" href={`${typeMedia}${item.id}`} style={{
                              backgroundImage: `url('${item.coverImage?.extraLarge}')`
                            }}>
                              <div className="image-text">
                                <div>{formattedRelation}</div>
                              </div>
                            </Link>
                            <div className="relationContent">
                              <div className="infoHeader">
                                <div>{formattedRelation}</div>
                              </div>
                              <Link href={`${typeMedia}${item.id}`} className="relationTitle">{item.title?.english || item.title?.romaji || ""}</Link>
                              <div className="relationInfo">{formattedFormat} · {formattedStatus}</div>
                            </div>
                          </div>
                      );
                    })}
              </div>
            </div></>}

          {(pathname === `/anime/${id}` || pathname.includes('/characters')) && <div className="characters">
            {pathname.includes("/characters") && <div className="chujec123">
              <Dropdown className="dropDown"
              >
                <div className="filter filter-select cosik123">

                  <DropdownTrigger className="dropDownTrigger">

                    <div className="select-wrap">
                      <div className="selectFilter">
                        <div className="value-wrap">
                          <div className="placeholder textChar">{formatedLanguage}</div>
                          <div className="filter">
                          </div>
                        </div>
                        <svg data-v-e3e1e202="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="arrowFilter"><path data-v-e3e1e202="" fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>

                      </div>

                    </div>

                  </DropdownTrigger>

                </div>



                <DropdownMenu className="menuDropdown" aria-label="Single selection example"
                              variant="flat"
                              disallowEmptySelection={false}
                              closeOnSelect={false}
                              selectionMode="single"
                              selectedKeys={selectedKeys.languages}
                              onSelectionChange={(keys) => handleSelectionChange("languages", keys as Set<string>)}
                >

                  {languages.map((item) => {

                    return (
                        <DropdownItem className="dropDownItem" key={item.key}>{item.name}</DropdownItem>
                    )
                  })}

                </DropdownMenu>
              </Dropdown>
            </div>}
            <div className="grid-wrap">

              {pathname === `/anime/${id}` && media3.characters?.edges?.slice(0, 6).map((edge, index) => {
                const item = edge.voiceActors?.[0] || {}; // Zabezpieczenie przed brakiem aktora
                const item2 = edge.node;

                const formattedName = edge.role
                    ?.toLowerCase()
                    .replace(/_/g, ' ') // Zamiana "_" na spację
                    .replace(/\b\w/g, char => char.toUpperCase());

                return (
                    <>
                      <div key={index} className="role-card view-character-staff">
                        <div className="character">
                          <Link className="coverCharacter" href={'#'} style={{
                            backgroundImage: `url('${item2.image?.large}')`
                          }} />
                          <Link href={'#'} className="contentCharacter">
                            <div className="characterName">{item2.name?.full}</div>
                            <div className="characterRole">{formattedName}</div>
                          </Link>
                        </div>
                        <div className="staff">

                          <Link href={'#'} className="contentCharacter">
                            <div className="characterName">{item.name?.full || 'Brak aktora'}</div>
                            <div className="characterRole">{item.languageV2 || '-'}</div>
                          </Link>
                          {item.image?.large && (
                              <Link className="coverCharacter" href={'#'} style={{
                                backgroundImage: `url('${item.image?.large}')`
                              }} />
                          )}
                        </div>
                      </div>


                    </>
                );
              })}

              {pathname.includes("/characters") && media.characters?.edges?.map((edge, index) => {
                const item = edge.voiceActors?.[0] || {}; // Zabezpieczenie przed brakiem aktora
                const item2 = edge.node;

                const formattedName = edge.role
                    ?.toLowerCase()
                    .replace(/_/g, ' ') // Zamiana "_" na spację
                    .replace(/\b\w/g, char => char.toUpperCase());

                return (
                    <>
                      <div key={index} className="role-card view-character-staff">
                        <div className="character">
                          <Link className="coverCharacter" href={'#'} style={{
                            backgroundImage: `url('${item2.image?.large}')`
                          }} />
                          <Link href={'#'} className="contentCharacter">
                            <div className="characterName">{item2.name?.full}</div>
                            <div className="characterRole">{formattedName}</div>
                          </Link>
                        </div>
                        <div className="staff">

                          <Link href={'#'} className="contentCharacter">
                            <div className="characterName">{item.name?.full || 'Brak aktora'}</div>
                            <div className="characterRole">{item.languageV2 || '-'}</div>
                          </Link>
                          {item.image?.large && (
                              <Link className="coverCharacter" href={'#'} style={{
                                backgroundImage: `url('${item.image?.large}')`
                              }} />
                          )}
                        </div>
                      </div>


                    </>
                );
              })}

              {isLoading && pathname.includes('/characters') && Array.from({ length: 6 }).map((_, index) => (<div key={index} className="role-card view-character-staff">
                <div className="character">
                  <Link className="coverCharacter" href={'#'} />
                  <Link href={'#'} className="contentCharacter">
                    <div className="characterName"></div>
                    <div className="characterRole"></div>
                  </Link>
                </div>
                <div className="staff">

                  <Link href={'#'} className="contentCharacter">
                    <div className="characterName"></div>
                    <div className="characterRole"></div>
                  </Link>
                  {
                    <Link className="coverCharacter" href={'#'} />
                  }
                </div>
              </div>))}
              <div ref={endOfListRef} className="h-[10px]"></div>




            </div>



          </div>}


          {(pathname === `/anime/${id}` || pathname.includes('/staff')) && media.staff?.edges.length > 0 && <div className="staff">
            <h2 className="Link">Staff</h2>
            <div className="grid-wrap">
              {media.staff?.edges?.slice(0, pathname.includes('/staff') ? undefined : (!isClass2 ? 4 : 3)).map((edge, index) => {

                const item2 = edge.node;

                const formattedName = edge.role
                    ?.toLowerCase()
                    .replace(/_/g, ' ') // Zamiana "_" na spację
                    .replace(/\b\w/g, char => char.toUpperCase());

                return (
                    <div key={index} className="role-card view-staff small2">
                      <div className="staff">
                        <Link className="coverCharacter" href={'#'} style={{
                          backgroundImage: `url('${item2.image?.large}')`
                        }} />
                        <Link href={'#'} className="contentCharacter">
                          <div className="characterName">{item2.name?.full}</div>
                          <div className="characterRole">{formattedName}</div>
                        </Link>
                      </div>

                    </div>
                );
              })}

              {isLoading3 && pathname.includes('/staff') && Array.from({ length: 6 }).map((_, index) => (<div key={index} className="role-card view-staff small2">
                <div className="staff">
                  <Link className="coverCharacter" href={'#'} />
                  <Link href={'#'} className="contentCharacter">
                    <div className="characterName"></div>
                    <div className="characterRole"></div>
                  </Link>
                </div>

              </div>))}
              <div ref={endOfListRef3} className="h-[10px]"></div>
            </div>

          </div>}




          {(pathname === `/anime/${id}` || pathname.includes("/stats")) && media.stats?.statusDistribution.length > 0 && <div className="grid-section-wrap">
            <div className="status-distribution">
              <h2 className="Link">Status Distribution</h2>

              <div className="status-distribution content-wrap">
                <div className="genres-overview gg">
                  {media.stats?.statusDistribution?.slice(0, 5).map((item) => {
                    const totalAmount = media.stats?.statusDistribution?.reduce((sum, item) => sum + item.amount, 0);
                    const percentage = (item.amount / totalAmount) * 100;



                    return { ...item, totalAmount, percentage };

                  }).sort((a, b) => b.percentage - a.percentage)
                      .map((item, index) => (
                          <div className="overview-genre" key={index}>
                            <div className="name-overview" style={{
                              background: `${color[index]}`
                            }}>
                              {item.status
                                  ?.toLowerCase()
                                  .replace(/_/g, ' ') // Zamiana "_" na spację
                                  .replace(/\b\w/g, char => char.toUpperCase())}
                            </div>
                            <div className="amount-overview" style={{
                              color: `${color[index]}`
                            }}>
                              {item.amount} <span className="label-overview">Users</span>
                            </div>
                          </div>
                      ))
                  }
                </div>
                <div className="percentage-bar-overview">

                  {media.stats?.statusDistribution?.slice(0, 6).map((item) => {
                    const totalAmount = media.stats?.statusDistribution?.reduce((sum, item) => sum + item.amount, 0);
                    const percentage = (item.amount / totalAmount) * 100;



                    return { ...item, totalAmount, percentage };

                  }).sort((a, b) => b.percentage - a.percentage)
                      .map((item, index) => {
                        return (
                            <Tooltip
                                key={index}
                                showArrow={true}
                                placement="top"
                                closeDelay={150}
                                delay={50}
                                className="Tooltipek"
                                color="foreground"
                                content={item.status?.toLowerCase()
                                    .replace(/_/g, ' ') // Zamiana "_" na spację
                                    .replace(/\b\w/g, char => char.toUpperCase())}
                                offset={30}
                                style={{
                                  zIndex: "1",
                                  color: `${color[index]}`,

                                }}
                            >
                              <div
                                  style={{ minWidth: `${item.percentage}%`, background: `${color[index]}` }} // Ustawienie minWidth w procentach
                                  className="el-tooltip percentage-overview"
                                  key={index}
                              >

                              </div>
                            </Tooltip>
                        );



                      })
                  }

                </div>
              </div>
            </div>




            <div>
              <h2 className="Link">
                Score Distribution
              </h2>

              <div className="chart media-score-distribution">

                <ChartContainer config={chartConfig} className="h-[113px] w-full">
                  <BarChart

                      data={chartData}
                      margin={{
                        top: 20,
                      }}
                  >

                    <XAxis
                        dataKey="score"
                        tickLine={false}
                        tickMargin={5}
                        axisLine={false}
                        className="labels"
                        color="red"
                        fontSize={9}
                    />
                    <ChartTooltip
                        cursor={false}
                        wrapperClassName="padding"
                        content={<ChartTooltipContent className="padding" hideLabel />}
                    />
                    <Bar dataKey="amount" fill={kolorek1} radius={8}>
                      <LabelList
                          position="top"
                          offset={9}
                          className="fill-foreground"
                          fontSize={9}
                      />
                    </Bar>

                  </BarChart>
                </ChartContainer>
              </div>
            </div>



          </div>}
          {pathname.includes("/stats") && airingProgression.length > 0 &&
              <>
                <h2 className="Link">
                  Airing Score & Watchers Progression
                </h2>
                <Card className="chart media-score-distribution rounded-[4px] !border-none">

                  <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer
                        config={chartConfig2}
                        className="aspect-auto h-[250px] w-full"
                    >
                      <AreaChart data={chartData3}>
                        <defs>

                          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor="#00BC80"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#00BC80"
                                stopOpacity={0.1}
                            />
                          </linearGradient>

                          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor="#B7D59E"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#B7D59E"
                                stopOpacity={0.1}
                            />
                          </linearGradient>






                        </defs>
                        <CartesianGrid className="gridColor" vertical={false} />
                        <XAxis
                            dataKey="episode"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            className="labels"
                            minTickGap={32}
                            fontSize={9}

                        />
                        <ChartTooltip
                            cursor={false}

                            content={
                              <ChartTooltipContent className="padding"
                                                   hideLabel
                                                   indicator="dot"

                              />
                            }
                        />





                        <Area
                            dataKey="score"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="#B7D59E"
                            stackId="a"
                        />



                        <Area
                            dataKey="watching"
                            type="natural"
                            fill="url(#fillMobile)"
                            stroke="#00BC80"
                            stackId="a"
                        />




                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </>}



          {(pathname === `/anime/${id}` || pathname.includes('/watch')) && media.streamingEpisodes?.length > 0 && <div className="Episodes">
            <h2 className="Link">Watch</h2>
            <div className={`EpisodesWrap ${pathname.includes('/watch') ? 'watchyk' : ''}`}>
              {media.streamingEpisodes?.slice(0, pathname.includes('/watch') ? undefined : 4).map((edge, index) => {

                return (
                    <Link key={index} href={edge.url} style={{
                      backgroundImage: `url('${edge.thumbnail}')`
                    }} className={`episode ${isClassMobile && pathname.includes("/watch") && 'episodeMobile'}`}>
                      <div className="episodeTitle">{edge.title}</div>
                    </Link>
                );
              })}
            </div>

          </div>}

          {pathname === `/anime/${id}` && filteredMediaIds?.length > 0 && <div className="grid-section-wrap">
            <div className="">
              <h2 className="Link">Following</h2>
              <div className="following">
                <div className="limit">
                  {filteredMediaIds.map((item, index) => (
                      <Link key={index} href={''} className="follow">
                        <div className="avatarFollow" style={{
                          backgroundImage: `url('${item.userAvatar}')`
                        }}></div>
                        <div className="nameFollow">{item.userName}</div>
                        <div className="statusFollow">{item.status.toLowerCase()
                            .replace(/_/g, ' ') // Zamiana "_" na spację
                            .replace(/\b\w/g, char => char.toUpperCase())}</div>
                        <span>{item.score}/10</span>
                      </Link>
                  ))}

                </div>
              </div>
            </div>
          </div>}

          {pathname === `/anime/${id}` && media.recommendations?.edges.length > 0 && <div className="recommendations">
            <h2 className="Link flex justify-center">Recommendations
              <div className="view-all2">
                <div className="toggle" onClick={() => setToggle(!isToggle)}>{isToggle ? "View less" : "View All Recommendations"}</div>
              </div>
            </h2>

            <div className="wrapRecommend">
              {media.recommendations?.edges?.slice(0, isToggle ? undefined : 7).map((item, index) => {
                const rel = item.node?.mediaRecommendation

                return (
                    < div key={index} className="recommendation-card" >
                      <div className="coverRecommendation">
                        <Link href={`${rel?.id}`} className="cover-link" style={{
                          backgroundImage: `url('${rel?.coverImage.extraLarge}')`
                        }}></Link>
                        <Link href={`${rel?.id}`}>
                          <div className="titleRecommend">
                            <div style={{
                              overflow: 'hidden'
                            }}>
                            <span style={{
                              boxShadow: 'transparent 0px 0px'
                            }}>
                              <span>{rel?.title?.english || rel?.title?.romaji}</span>
                            </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                )
              })}

              {isLoading2 && Array.from({ length: 6 }).map((_, index) => (<div key={index} className="recommendation-card bog" >
                <div className="coverRecommendation">
                  <Link href={``} className="cover-link" ></Link>
                  <Link href={``}>
                    <div className="titleRecommend">
                      <div style={{
                        overflow: 'hidden'
                      }}>
                        <span style={{
                          boxShadow: 'transparent 0px 0px'
                        }}>
                          <span></span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>))}

              {isToggle && <div ref={endOfListRef2} className="h-[10px]"></div>}

            </div>
          </div>}





          {children}
        </div >
      </div ></>)}

      <Nav />
    </>
  );
}
