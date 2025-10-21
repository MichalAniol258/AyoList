"use client"
import { useState, useCallback } from 'react';
import Header from "./header.jsx"
import Home2 from "./home.jsx"

export default function Home() {
    const [focus, setFocus] = useState(false)


    const handleChangeFocus = useCallback((isFocused: boolean) => {
        setFocus(isFocused)
    }, [])

    return (
        <>
            <div className="container">
                <Header handleChangeFocus={handleChangeFocus} />

                    <div className={focus ? "containerHidden" : ""}>

                            <Home2 />

                    </div>



            </div>
        </>
    );
}
