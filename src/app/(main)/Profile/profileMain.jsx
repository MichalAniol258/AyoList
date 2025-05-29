"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  {
    path: "/Profile/Overview",
    name: "Overview"
  },
  {
    path: "/Profile/Animelist",
    name: "Anime List"
  },
  {
    path: "/Profile/Mangalist",
    name: "Manga List"
  },
  {
    path: "/Profile/Stats/Anime/Overview",
    name: "Stats"
  },
  {
    path: "/Profile/Settings",
    name: "Settings"
  }
]


export default function ProfileMain() {
  let pathname = usePathname() || "/"





  return (
    <nav className="navik">
      <ul>
        <li>
          {navItems.map((item) => {
            const isActive = item.path === pathname

            return (
              <Link
                key={item.path}
                className="aLink2"
                style={{
                  color: `${isActive ? "#14b8a6" : ""}`,
                  display: "flex",

                  justifyContent: "center",
                  alignItems: "center"
                }}
                data-active={isActive}
                href={item.path}


              >
                {item.name}
                {isActive && (
                  <motion.div
                    className="animacja2"
                    layoutId="navbar2"
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
        </li>
      </ul>
    </nav>
  )

}
