"use client"

import { motion } from "framer-motion"
import Link from "next/link.js"
import { usePathname } from "next/navigation.js"
import { createContext, useContext, useState } from "react"
import { gql, useQuery } from "@apollo/client"

import { useUser } from "../../components/userInfoWrapper";
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
  type: string
  genres: string
}
interface entries {
  media: media
}

interface lists {
  entries: entries[]
}

interface MediaListCollection {
  lists: lists[]; // Zmienione na tablicę
}
interface User {
  User: Statistics;
  MediaListCollection: MediaListCollection;
}
interface LayoutContextProps {
  statsData: User;
  statsLoading: boolean
  mediaData: User;
  mediaLoading: boolean
}

export const LayoutContext = createContext<LayoutContextProps | null>(null);

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("kurwa")
  }
  return context;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userInfo } = useUser();

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










  const animeList = [
    {
      name: "Overview",
      path: "/Profile/Stats/Anime/Overview"
    },
    {
      name: "Genres",
      path: "/Profile/Stats/Anime/Genres"
    },
    {
      name: "Tags",
      path: "/Profile/Stats/Anime/Tags"
    },
    {
      name: "Voice Actors",
      path: "/Profile/Stats/Anime/Voice-actors"
    },
    {
      name: "Studios",
      path: "/Profile/Stats/Anime/Studios"
    },
    {
      name: "Staff",
      path: "/Profile/Stats/Anime/Staff"
    },
  ]

  const mangaList = [
    {
      name: "Overview",
      path: "/Profile/Stats/Manga/Overview"
    },
    {
      name: "Genres",
      path: "/Profile/Stats/Manga/Genres"
    },
    {
      name: "Tags",
      path: "/Profile/Stats/Manga/Tags"
    },
    {
      name: "Staff",
      path: "/Profile/Stats/Manga/Staff"
    },
  ]



  const [isToggle, setToggle] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredIndex2, setHoveredIndex2] = useState<number | null>(null)
  const pathname = usePathname() || "/";
  function handleToggle() {
    setToggle(!isToggle)
  }
  return (
    <div className="container1">


      <div className="contentContainer">
        <div className="all all2">
          <div className="contentWhole">
            <div className="content2">
              <p>Youngjamal&apos;s Stats</p>
            </div>

            <div className={`contentFilter ${isToggle ? 'buttonActive' : 'buttonNoActive'}`} onClick={() => handleToggle()}
            >
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
                preserveAspectRatio="xMidYMid meet" className={`filterIcon`}>
                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                  fill="currentColor" stroke="none">
                  <path d="M500 3184 c-234 -50 -436 -254 -485 -489 -95 -454 306 -855 760 -760
      288 60 505 329 505 625 0 406 -380 710 -780 624z"/>
                  <path d="M2420 3184 c-234 -50 -436 -254 -485 -489 -95 -454 306 -855 760
      -760 238 50 440 252 490 490 95 456 -309 857 -765 759z"/>
                  <path d="M4340 3184 c-234 -50 -436 -254 -485 -489 -95 -454 306 -855 760
      -760 238 50 440 252 490 490 95 456 -309 857 -765 759z"/>
                </g>
              </svg>
            </div>

            <div className={`listContainer ${isToggle ? 'buttonActive' : 'buttonNoActive'}`}>
              <div className="group">
                <div className="list list2">
                  <p>Anime Stats</p>
                </div>

                {animeList.map((item, index) => {
                  const isActive = item.path === pathname;
                  const isHovered = hoveredIndex2 === index;

                  const transitionVariants = {
                    active: { backgroundColor: '#111e22', color: "rgb(149, 164, 185)" },
                    inactive: { backgroundColor: 'rgba(17, 30, 34, 0)', color: "rgb(124, 137, 154)" },
                    hovered: { backgroundColor: "#111e22" }
                  };

                  return (
                    <Link href={item.path} key={item.path}>
                      <motion.div
                        className={`${pathname === "/Profile/Animelist" ? "listOption" : "listOption listOption2"} ${isActive ? 'optionActive2' : ''}`}
                        initial="inactive"
                        animate={isHovered ? 'hovered' : isActive ? 'active' : 'inactive'}
                        variants={transitionVariants}
                        onMouseOver={() => setHoveredIndex2(index)}
                        onMouseOut={() => setHoveredIndex2(null)}
                        transition={{ duration: 0, ease: 'easeInOut' }}
                      >
                        {item.name}
                      </motion.div>
                    </Link>
                  )
                })}
              </div>



              <div className="group">
                <div className="list list2">
                  <p>Manga Stats</p>
                </div>

                {mangaList.map((item, index) => {
                  const isActive = item.path === pathname;
                  const isHovered = hoveredIndex === index;

                  const transitionVariants = {
                    active: { backgroundColor: '#111e22', color: "rgb(149, 164, 185)" },
                    inactive: { backgroundColor: 'rgba(17, 30, 34, 0)', color: "rgb(124, 137, 154)" },
                    hovered: { backgroundColor: "#111e22" }
                  };
                  return (
                    <Link href={item.path} key={item.path}>
                      <motion.div
                        className={`${pathname === "/Profile/Animelist" ? "listOption" : "listOption listOption2"} ${isActive ? 'optionActive2' : ''}`}
                        initial="inactive"
                        animate={isHovered ? 'hovered' : isActive ? 'active' : 'inactive'}
                        variants={transitionVariants}
                        onMouseOver={() => setHoveredIndex(index)}
                        onMouseOut={() => setHoveredIndex(null)}
                        transition={{ duration: 0, ease: 'easeInOut' }}
                      >
                        {item.name}
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
          <LayoutContext.Provider value={{ statsData, statsLoading, mediaData, mediaLoading }}>
            {children}
          </LayoutContext.Provider>
        </div>

      </div>

    </div >
  );
}
