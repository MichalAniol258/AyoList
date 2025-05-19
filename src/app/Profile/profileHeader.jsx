"use client"
import Image from "next/image";
import { useUser } from "../components/userInfoWrapper"


export default function ProfileHeader() {

  const { userInfo } = useUser();


  if (!userInfo) return  null;



  return (
    <section className="sPHeader">
      <header>

        <div className="pBaner" style={{
          background: `url('${userInfo?.bannerImage}')`
        }}>
          <div className="pIcon">
            <svg version="1.0" className="profileIcon" xmlns="http://www.w3.org/2000/svg"
              width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
              preserveAspectRatio="xMidYMid meet">

              <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                fill="currentColor" stroke="none">
                <path d="M3795 5105 c-168 -31 -308 -107 -436 -234 -99 -99 -167 -206 -204
                            -323 -59 -187 -59 -304 2 -554 4 -17 -84 -75 -673 -440 -372 -230 -681 -420
                            -685 -422 -4 -2 -43 26 -86 62 -92 78 -226 148 -338 178 -107 28 -298 30 -400
                            4 -253 -66 -471 -245 -571 -472 -52 -119 -68 -199 -68 -344 0 -145 16 -225 68
                            -344 99 -222 313 -402 557 -467 115 -31 298 -31 414 -1 112 30 246 100 338
                            178 43 36 82 64 86 62 4 -2 313 -192 685 -422 589 -365 677 -423 673 -440 -61
                            -251 -61 -374 -1 -556 41 -122 99 -215 199 -316 135 -137 282 -214 467 -244
                            419 -68 830 206 939 625 46 176 22 402 -61 570 -144 292 -433 469 -760 467
                            -216 -1 -399 -73 -561 -220 l-54 -49 -370 230 c-203 126 -512 317 -685 424
                            -173 108 -316 196 -317 197 -1 1 6 30 17 65 45 151 45 331 0 482 -11 35 -18
                            64 -17 65 1 1 144 89 317 197 173 107 482 298 685 424 l370 230 62 -56 c255
                            -228 623 -280 928 -131 220 108 389 318 446 555 30 121 30 287 0 400 -112 430
                            -534 701 -966 620z m296 -311 c274 -81 439 -358 374 -632 -23 -96 -70 -179
                            -144 -253 -113 -113 -252 -166 -406 -156 -139 10 -249 60 -345 158 -210 213
                            -199 565 23 765 57 51 124 88 207 115 72 23 217 25 291 3z m-2748 -1732 c153
                            -55 275 -178 328 -332 33 -92 33 -248 0 -340 -54 -153 -176 -278 -326 -331
                            -84 -30 -220 -36 -305 -14 -239 62 -400 269 -400 514 0 242 151 443 385 513
                            82 24 236 19 318 -10z m2725 -1707 c193 -46 351 -203 397 -396 65 -275 -99
                            -552 -374 -633 -71 -21 -211 -21 -282 0 -185 55 -318 188 -373 373 -20 69 -21
                            199 -1 276 51 195 226 355 425 388 56 9 149 6 208 -8z"/>
              </g>
            </svg>
          </div>

          <div className="profile two">
            <div className="profilePhotos">
              <Image src={userInfo?.avatar?.large} rel="preload" className="profileImage" width={'50'} height={'50'} alt="avatar" unoptimized ></Image>

            </div>
            <p>{userInfo?.name}</p>
          </div>
        </div>

        <div className="pNavBar">
          <nav>
            <ul>
              <li>
                <a>
                  <p>565</p>
                  <p>Anime Total</p>
                </a>
              </li>

              <li>
                <a >
                  <p>45</p>
                  <p>Total Anime</p>
                </a>
              </li>

              <li>
                <a>
                  <p>666</p>
                  <p>Total Manga</p></a>
              </li>

              <li>
                <a>
                  <p>1244</p>
                  <p>Total Anime</p></a>
              </li>
            </ul>
          </nav>
        </div>



      </header>
    </section >
  );
}
