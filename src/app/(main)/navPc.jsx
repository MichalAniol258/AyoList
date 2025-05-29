"use client"
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "@/src/app/(main)/components/userInfoWrapper"
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from 'next/navigation'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/react";



const SEARCH_ANIME = gql`
query SearchAnime($search: String, $isAdult: Boolean, $type: MediaType) {
  Page {
    media(search: $search, type: $type, isAdult: $isAdult) {
      id
      title {
        romaji
        english
      }
      coverImage {
        extraLarge
      }
      format
      startDate {
        year
      }
      characters {
        nodes {
          image {
            large
          }
          name {
            full
          }
        }
      }
    }
  }
}


`;


const SEARCH_CHARACTERS = gql`
query($search: String) {
  Page(page: 1, perPage: 10) {
    characters(search: $search) {
      id
      name {
        full
        native
      }
      image {
        large
      }
      gender
      age
      description
    }
  }
}



`;

const navPcItems = [
  { name: "Home", path: "/" },
  { name: "Profile", path: "/Profile/Overview" },
  { name: "Anime List", path: "/Profile/Animelist" },
  { name: "Manga List", path: "/Profile/Mangalist" },
  { name: "Browse", path: "/Browse" },
]





export default function NavPc() {
  const { userInfo } = useUser();








  let pathname = usePathname() || "/";

  if (pathname.includes("/Profile/") && !pathname.includes("/Profile/Animelist") && !pathname.includes("/Profile/Mangalist")) {
    pathname = "/Profile/Overview"
  }

  if (pathname.includes("/Browse/")) {
    pathname = "/Browse"
  }







  const [isHidden, setIsHidden] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [focus, setFocus] = useState(false)

  const router = useRouter();

  const handleDeleteCookie = async () => {
    const res = await fetch('/api/auth/delete_access_token');
    if (res.ok) {
      router.push('/login')
    }
  };

  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;
    const poczatek = y;

    if (Math.abs(difference) > 50) {
      setIsHidden(difference > 0)
      lastYRef.current = y;
    }

    if (Math.abs(poczatek) > 50) {
      setHovered(true)
    } else {
      setHovered(false)
    }
  })

  const variants = {
    inputVisible: { top: "80px" },
    inputNotVisible: { top: "0px" },
    conVisible: { opacity: 1, display: "block", top: 0 },
    conNotVisible: { opacity: 0, display: "none", top: 0, },
    yesAni: { opacity: 1, scale: 1, display: "", },
    nahAni: { opacity: 0, scale: 0.95, display: "none" },
  }

  const [query, setQuery] = useState('')
  const [showResults, setResults] = useState(false)
  const isAdult = false;

  const [SearchAnime, { loading, data, error }] = useLazyQuery(SEARCH_ANIME, {
    fetchPolicy: 'cache-and-network',
  });

  const animePath = "/anime/";
  const mangaPath = "/manga/";
  const [SearchManga, { loading: loadingManga, data: dataManga, error: errorManga }] = useLazyQuery(SEARCH_ANIME, {
    fetchPolicy: 'cache-and-network',
  });

  const [SearchCharacters, { loading: loadingCharacters, data: dataCharacters, error: errorCharacters }] = useLazyQuery(SEARCH_CHARACTERS, {
    fetchPolicy: 'cache-and-network',
  });

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };




  const handleSearch = debounce((query) => {
    if (query.trim() !== "") {
      SearchAnime({ variables: { search: query, isAdult, type: "ANIME" } })
      SearchManga({ variables: { search: query, isAdult, type: "MANGA" } })
      SearchCharacters({ variables: { search: query } })
      setResults(true);
    } else {
      setResults(false);
    }
  }, 300);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value)
    handleSearch(value)

    if (value.trim() === '') {
      setResults(false);
    }
  };


  function cosik() {
    setQuery('')
    setResults(false)
    setFocus(false)
  }




  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setQuery('')
      setResults(false)
      setFocus(false)
    }
  };

  if (!userInfo) return  null;

  const params = new URLSearchParams({search: query, type: "Anime"}).toString();
  const paramsManga = new URLSearchParams({search: query, type: "Manga"}).toString();

  return (
      <>
        <motion.section className="navikPc"
                        animate={isHidden ? "hidden" : !pathname.includes("/Profile") && !pathname.includes("/anime") && !pathname.includes("/manga") ? "normal" : isHovered ? "hovered" : "unHovered"}
                        variants={{
                          hovered: {
                            backgroundColor: "hsla(194, 33%, 10%, 1)"
                          },
                          unHovered: {
                            backgroundColor: "hsla(194, 33%, 10%, 0.5)"
                          },

                          hidden: {
                            backgroundColor: "hsla(194, 33%, 10%, 0)"
                          },
                          normal: {
                            backgroundColor: "hsla(194, 33%, 10%, 1)"
                          },

                        }}

                        duration={{ duration: 0.2 }}
        >
          <motion.div className="navikPcBody"
                      animate={isHidden ? "hidden" : "visible"}
                      variants={{
                        hidden: {
                          y: "-100%",

                        },
                        visible: {
                          y: "0%",

                        }
                      }}


                      duration={{ duration: 0.2 }}
          >

            <Link href={"/"} className="logoNavPc"
                  onMouseOver={() => setHovered(true)}
                  onMouseOut={() => setHovered(false)}>
              <img src={"/images/2.png"} width={50} height={50} className="navPcLogo" alt="cos"/>
            </Link>

            <div className="links">
              {navPcItems.map((item) => {

                const isActive = item.path === pathname;

                return (
                    <Link
                        key={item.path}
                        className={`aLink`}
                        data-active={isActive}
                        href={item.path}

                        style={{
                          color: `${isActive ? "rgb(20, 184, 166)" : ""}`,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "8px 16px"
                        }}
                        onMouseOver={() => setHovered(true)}
                        onMouseOut={() => setHovered(false)}




                    >

                      {item.icon && item.icon(isActive)}
                      {item.name}
                      {isActive && (
                          <motion.div
                              className="animacja"
                              layoutId="navPc"
                              aria-hidden="true"
                              style={{
                                width: "100%",
                                originY: "0px",
                              }}
                              transition={{
                                type: "spring",
                                bounce: 0.25,
                                stiffness: 130,
                                damping: 9,
                                duration: 0.3,
                              }}
                          />
                      )}
                    </Link>
                )

              })}
            </div>

            <div className="searchNavPc">
              <svg tabIndex={0}
                   onKeyDown={handleKeyDown} data-v-62eacfff="" onClick={() => setFocus(true)} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="navPCSearch"><path data-v-62eacfff="" fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>
            </div>



            <div className="userNavPc">
              <div className="navImgContainer">
                <Dropdown
                    showArrow
                    className="menuAll"
                >
                  <DropdownTrigger>
                    <Image rel="preload" src={`${userInfo?.avatar.large}`} className="imageContainer" width={25} height={25} alt="navimgcontainer" unoptimized></Image>
                  </DropdownTrigger>
                  <DropdownMenu
                      aria-label="Custom item styles"
                      className="menuDropdown gg2"
                      disabledKeys={["profile"]}

                  >

                    <DropdownSection className="menuSectionProfile" aria-label="Profile & Actions">
                      <DropdownItem
                          className="menuProfile"
                          key="dashboard"
                      >
                        <div className="menuProfile">

                          <Link className="chujec200" href={"/Profile/Overview"}>
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path data-v-04b245e6="" fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                            Profile
                          </Link>

                        </div>
                      </DropdownItem>

                    </DropdownSection>



                    <DropdownSection className="menuSection" aria-label="Help & Feedback">
                      <DropdownItem key="logout" className="menuLogout" onClick={handleDeleteCookie}>
                        <div className="menuLogout">
                          <svg data-v-04b245e6="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sign-out-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path data-v-04b245e6="" fill="currentColor" d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path></svg>
                          Logout
                        </div>
                      </DropdownItem>
                    </DropdownSection>

                  </DropdownMenu>
                </Dropdown>


              </div>
            </div>
          </motion.div>

          <motion.div className={`quickSearch visible ${focus ? "scroll" : ""}`}
                      animate={focus ? "conVisible" : "conNotVisible"}
                      initial={false}
                      transition={{ duration: 0.3 }}
                      variants={variants}
                      tabIndex={0}
                      onKeyDown={handleKeyDown}
          >
            <motion.div className="inputQuickSearch"
                        animate={focus ? "inputVisible" : "inputNotVisible"}
                        initial={false}
                        transition={{ duration: 0.1 }}
                        variants={variants}>
              <svg data-v-17620a08="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="ikonka"><path data-v-17620a08="" fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>
              <input onKeyDown={handleKeyDown} className="inputquickSearch" value={query} onChange={handleChange} type="text" placeholder="Search AyoList" />
              <svg data-v-17620a08="" onClick={() => cosik()} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="ikonkaX"><path data-v-17620a08="" fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>
              <div className="hint">
                Hint: Hit Esc to quickly exit Search
              </div>
            </motion.div>


            <motion.div className={'results2'}
                        animate={showResults && query ? "yesAni" : "nahAni"}
                        initial="nahAni"
                        variants={variants}
                        transition={{ duration: 0.2 }}

            >


              <motion.div className="result2-col"
                          animate={showResults && query && data?.Page?.media.length > 0 ? "yesAni" : "nahAni"}
                          initial="nahAni"
                          variants={variants}
                          transition={{ duration: 0.2 }}
                          style={{ display: data?.Page?.media.length > 0 ? "block" : "none" }}
              >


                <h3 className="results2Title">Anime</h3>
                {error && <p style={{
                  color: "white"
                }}>error {error.message}</p>}
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="result2">
                          <div className="podResult2">
                            <a href="">
                              <div className="results2Img" />


                              <p className="results2Name skeleton-text2">


                                <div className="results2Info">
                                  <span></span>
                                  <span></span>
                                </div>
                              </p>
                            </a>
                          </div>
                        </div>
                    ))
                ) : (
                    data?.Page?.media.slice(0, 8).map((item) => (


                        <div key={item.id} className="result2">
                          <div className="podResult2">
                            <Link href={`${animePath}${item.id}`}>
                              <img className="results2Img" src={item.coverImage.extraLarge} alt={item.title.romaji} />


                              <p className="results2Name">
                                {item.title?.english === null ? item.title?.romaji : item.title?.english}

                                <div className="results2Info">
                                  <span className="spanik">{item.startDate.year} </span>
                                  <span className="spanik">{item.format}</span>
                                </div>
                              </p>
                            </Link>
                          </div>
                        </div>






                    ))
                )}
                {data?.Page?.media.length >= 8 && < div className="view-all result2">
                  <Link href={`/Browse?${params}`}>View all anime results</Link>
                </div>}



              </motion.div>

              <motion.div className="result2-col"
                          animate={showResults && query && !loading && dataManga?.Page?.media.length > 0 ? "yesAni" : "nahAni"}
                          initial="nahAni"
                          variants={variants}
                          transition={{ duration: 0.2 }}
                          style={{ display: dataManga?.Page?.media.length > 0 ? "block" : "none" }}>


                <h3 className="results2Title">Manga</h3>
                {errorManga && <p style={{
                  color: "white"
                }}>error {errorManga.message}</p>}
                {loadingManga ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="result2">
                          <div className="podResult2">
                            <a href="">
                              <div className="results2Img" />


                              <p className="results2Name skeleton-text2">


                                <div className="results2Info">
                                  <span></span>
                                  <span></span>
                                </div>
                              </p>
                            </a>
                          </div>
                        </div>
                    ))
                ) : (
                    dataManga?.Page?.media.slice(0, 8).map((item) => (


                        <div key={item.id} className="result2">
                          <div className="podResult2">
                            <Link href={`${mangaPath}${item.id}`}>
                              <img className="results2Img" src={item.coverImage.extraLarge} alt={item.title.romaji} />


                              <p className="results2Name">
                                {item.title?.english === null ? item.title?.romaji : item.title?.english}

                                <div className="results2Info">
                                  <span className="spanik">{item.startDate.year} </span>
                                  <span className="spanik">{item.format}</span>
                                </div>
                              </p>
                            </Link>
                          </div>
                        </div>






                    ))
                )}
                {dataManga?.Page?.media.length >= 8 && < div className="view-all result2">
                  <Link href={`/Browse?${paramsManga}`}>View all manga results</Link>
                </div>}



              </motion.div>


              <motion.div className="result2-col"
                          animate={showResults && query && !loadingManga && dataCharacters?.Page?.characters.length > 0 ? "yesAni" : "nahAni"}
                          initial="nahAni"
                          variants={variants}
                          transition={{ duration: 0.2 }}>


                <h3 className="results2Title">Characters</h3>


                {errorCharacters && (
                    <p style={{ color: 'white' }}>
                      error {errorCharacters?.message}
                    </p>
                )}

                {loadingCharacters ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="result2">
                          <div className="podResult2">
                            <a href="#">
                              <div className="results2Img" />
                              <p className="results2Name skeleton-text2">
                                <div className="results2Info">
                                  <span></span>
                                  <span></span>
                                </div>
                              </p>
                            </a>
                          </div>
                        </div>
                    ))
                ) : (
                    dataCharacters?.Page?.characters.slice(0, 8).map((item) => (
                        <div key={item.id} className="result2">
                          <div className="podResult2">
                            <a href="#">
                              <img
                                  className="results2Img"
                                  src={item.image?.large}
                                  alt={item.name.full}
                              />
                              <p className="results2Name">{item.name.full}</p>
                            </a>
                          </div>
                        </div>
                    ))
                )}

                {/* dataCharacters?.Page?.characters.length >= 8 && (
                <div className="view-all result2">
                  <a href="#">View all characters results</a>
                </div>
              ) */}



              </motion.div>

            </motion.div>




          </motion.div>

        </motion.section >
      </>
  );
}
