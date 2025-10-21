// components/FontAwesomeLink.tsx
"use client";

import React from "react";

export default function FontAwesomeLink() {
    return (
        <link
            rel="preload"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
            as="style"
            onLoad={(e) => {
                e.currentTarget.rel = "stylesheet";
            }}
            integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
        />
    );
}
