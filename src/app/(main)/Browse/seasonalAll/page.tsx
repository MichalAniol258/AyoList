"use client"
import Nav from "../../nav.jsx"
import Header from "../../header.jsx"
import NavPc from "../../navPc.jsx"

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function SeasonalAll() {
    const [focus, setFocus] = useState(false)

    const handleChangeFocus = (isFocused: boolean) => {
        setFocus(isFocused)
    }

    const pathname = usePathname() || "/";
    return (

        <div className={`${pathname.includes("/Browse") ? "grzegorz" : ""}`}>

            <div className={`container ${pathname.includes("/Browse") ? "browseContainer" : ""}`}>
                <NavPc></NavPc>

                <Header handleChangeFocus={handleChangeFocus}></Header>
                <div className={focus ? "" : ""}></div>
                <Nav></Nav>
            </div>

        </div>
    );
}
