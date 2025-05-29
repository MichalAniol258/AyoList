"use client"
import { useState } from 'react';
import Nav from "./nav.jsx"
import Header from "./header.jsx"
import AnimeSeason from "./AnimeSeason.jsx"
import PopularNow from "./PopularNow.jsx"
import NextSeason from "./NextSeason.jsx"
import NavPc from "./navPc.jsx"
import PopularManga from "./PopularManga.jsx"
import Emission from "./Emission.jsx"



export default function Home() {
  const [focus, setFocus] = useState(false)
  const handleChangeFocus = (isFocused: boolean) => {
    setFocus(isFocused)
  }






  return (

    <>
      <div className="container">
        <NavPc></NavPc>
        <Header handleChangeFocus={handleChangeFocus}></Header>
        <div className={`${focus ? "containerHidden" : ""}`}>
          <div></div>
          <Emission></Emission>

          <AnimeSeason></AnimeSeason>
          <PopularNow></PopularNow>
          <NextSeason></NextSeason>
          <PopularManga></PopularManga>
          <Nav></Nav>
        </div>
      </div>

    </>
  );
}
