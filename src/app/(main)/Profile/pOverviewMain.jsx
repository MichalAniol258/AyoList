"use client"
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/src/app/(main)/components/userInfoWrapper"
import { useUserContext } from "@/src/app/(main)/components/userMainWrapper"
import Link from "next/link";
import {useQueryContext} from "@/src/app/(main)/components/queryProvider";
import {useCallback} from "react";




export default function POverviewMain() {
  const { userInfo } = useUser();
  const { userData, userLoading } = useUserContext();
  const {activityData, activityLoading, activityError, fetchMoreActivity} = useQueryContext();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const fetchMore = fetchMoreActivity;





  const loadMore = useCallback(() => {
    if (!activityLoading && activityData?.Page?.pageInfo?.hasNextPage) {
      setIsLoading(true)
      fetchMore({
        variables: {
          page: activityData.Page.pageInfo.currentPage + 1
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;
          const mergedActivities = [
            ...previousResult.Page.activities,
            ...fetchMoreResult.Page.activities.filter((newItem) =>
              !previousResult.Page.activities.some((oldItem) => oldItem.id === newItem.id))
          ];
          return {
            ...fetchMoreResult,
            Page: {
              ...fetchMoreResult.Page,
              activities: mergedActivities
            }
          };
        }
      }).finally(() => setIsLoading(false));

    }
  }, [activityData, activityLoading, fetchMore])




  const handleScroll = useCallback(() => {
    if (pathname.includes("/Profile/")) {
      if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200
      ) {
        loadMore();
      }
    }
  }, [pathname, loadMore]);

  // Dodanie event listenera do scrollowania
  useEffect(() => {
    if (pathname.includes("/Profile/")) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

  }, [handleScroll, pathname]);





  const anime = userData?.User?.statistics?.anime || [];
  const manga = userData?.User?.statistics?.manga || [];
  const activities = activityData?.Page?.activities || [];


  let totalRead = manga.chaptersRead
  let totalWatched = (anime.minutesWatched / 1440).toFixed(1);
  let dolnaGranicaAnime, nastepnyPrzedzial1Anime, nastepnyPrzedzial2Anime;

  dolnaGranicaAnime = Math.floor(totalWatched / 100) * 100;
  nastepnyPrzedzial1Anime = dolnaGranicaAnime + 50;
  nastepnyPrzedzial2Anime = dolnaGranicaAnime + 100;


  while (totalWatched > nastepnyPrzedzial2Anime) {
    dolnaGranicaAnime += 50;
    nastepnyPrzedzial1Anime += 50;
    nastepnyPrzedzial2Anime += 50;
  }


  const przedzialZakresAnime = nastepnyPrzedzial2Anime - dolnaGranicaAnime;
  const percentageAnime = (((totalWatched - dolnaGranicaAnime) / przedzialZakresAnime) * 100);

  let dolnaGranica, nastepnyPrzedzial1, nastepnyPrzedzial2;

  if (totalRead < 1000) {

    dolnaGranica = 0;
    nastepnyPrzedzial1 = 500;
    nastepnyPrzedzial2 = 1000;
  } else if (totalRead >= 1000 && totalRead <= 10000) {

    dolnaGranica = Math.floor(totalRead / 1000) * 1000;
    nastepnyPrzedzial1 = dolnaGranica + 500;
    nastepnyPrzedzial2 = dolnaGranica + 1000;
  } else if (totalRead > 10000) {

    dolnaGranica = Math.floor(totalRead / 1000) * 1000;
    nastepnyPrzedzial1 = dolnaGranica + 500;
    nastepnyPrzedzial2 = dolnaGranica + 1000;


    while (totalRead > nastepnyPrzedzial2) {
      dolnaGranica += 500;
      nastepnyPrzedzial1 += 500;
      nastepnyPrzedzial2 += 500;
    }
  }




  const przedzialZakres = nastepnyPrzedzial2 - dolnaGranica;
  const percentageRead = (((totalRead - dolnaGranica) / przedzialZakres) * 100)









  if (activityError) return <p>Error: {activityError.message}</p>;


  if (!userInfo) return  null;

  if (userLoading) {
    return <div className="rotating"><div className="rotating-text">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
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
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢘⡇⠸⣿⢋⣿⠟⠋⢁⡿⢠⠛⠠⠌⠉⣿⡿⣿⣿⡿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣷⢿⣿⣿⣿⣿⡟⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢷⣧⣼⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀</div></div>

  }

  return (

    <>

      <div className="">
        {userLoading && <div className="rotating-text">Kręcący się tekst</div>}

        <div className="stats-wrap">

          <div className="pStats">

            <div className="statsBody">
              <div className="stat">
                <div className="value">{anime?.count}</div>
                <div className="label-stat">Total Anime</div>
              </div>

              <div className="stat">
                <div className="value">{(anime?.minutesWatched / 1440).toFixed(1)}</div>
                <div className="label-stat">Days Watched</div>
              </div>

              <div className="stat">
                <div className="value">{anime?.meanScore?.toFixed(1)}</div>
                <div className="label-stat">Mean Score</div>
              </div>
            </div>

            <div className="pFooter">
              <div className="milestones">
                <div className="milestone">{`${dolnaGranicaAnime}`}</div>
                <div className="milestone">{`${nastepnyPrzedzial1Anime}`}</div>
                <div className="milestone">{`${nastepnyPrzedzial2Anime}`}</div>
              </div>

              <div className="progress">
                <div style={{
                  width: `${percentageAnime}%`
                }} className="bar second"></div>
              </div>
            </div>
          </div>

          <div className="pStats">
            <div className="statsBody">

              <div className="stat">
                <div className="value">{manga?.count}</div>
                <div className="label-stat">Total Manga</div>
              </div>

              <div className="stat">
                <div className="value">{manga?.chaptersRead}</div>
                <div className="label-stat">Chapters Read</div>
              </div>

              <div className="stat">
                <div className="value">{manga?.meanScore?.toFixed(1)}</div>
                <div className="label-stat">Mean Score</div>
              </div>
            </div>

            <div className="pFooter">
              <div className="milestones">
                <div className="milestone">{`${dolnaGranica}`}</div>
                <div className="milestone">{`${nastepnyPrzedzial1}`}</div>
                <div className="milestone">{`${nastepnyPrzedzial2}`}</div>
              </div>

              <div className="progress">
                <div style={{
                  width: `${percentageRead}%`
                }} className="bar second"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="activity">
          <div className="activityH">
            <p>Activity</p>

          </div>
          <div>

          </div>
          <div className="wholeList">
            {activities?.map((item, index) => {
              const itemCreatedAt = new Date(item.createdAt * 1000);
              const now = new Date();
              const timeDifference = now - itemCreatedAt;
              const seconds = Math.floor(timeDifference / 1000);
              const minutes = Math.floor(seconds / 60);
              const hours = Math.floor(minutes / 60);
              const days = Math.floor(hours / 24);

              let timeAgo = '';
              if (days > 0) {
                timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
              } else if (hours > 0) {
                timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
              } else if (minutes > 0) {
                timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
              } else {
                timeAgo = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
              }


              return (
                <div className="activity-entry" key={index}>
                  <div className="wrap">
                    <div className="activityList small">
                      <a style={{
                        backgroundImage: `url(${item.media?.coverImage.extraLarge})`
                      }} className="activityImg"></a>
                      <div className="activityDetails">
                        <div className="status-activity">
                          {item.status} {item.progress} of <Link href={`/${item.media?.type.toLowerCase()}/${item.media?.id}`} className="activitySpan">{
                            item.media?.title?.english === null ? item.media?.title?.romaji : item.media?.title?.english}</Link>
                        </div>
                      </div>

                      <div className="time">
                        <p>{timeAgo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && Array.from({ length: 6 }).map((_, index) => (
              <div className="activity-entry" key={index}>
                <div className="wrap">
                  <div className="activityList small">
                    <a style={{
                      backgroundImage: `url(${undefined})`
                    }} className="activityImg"></a>
                    <div className="activityDetails">
                      <div className="status-activity">

                      </div>
                    </div>

                    <div className="time">

                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>


      </div >


    </>

  );
}
