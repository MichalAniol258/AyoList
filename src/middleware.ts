import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ANILIST_USERINFO_URL = "https://graphql.anilist.co";

export async function middleware(req: NextRequest) {

    if (
        req.nextUrl.pathname.startsWith("/_next") ||
        req.nextUrl.pathname.startsWith("/images") ||
        req.nextUrl.pathname.startsWith("/favicons") ||
        req.nextUrl.pathname.startsWith("/public") ||
        req.nextUrl.pathname.startsWith("/api/auth/anilist")
    ) {
        return NextResponse.next();
    }


    // Pobieramy ciasteczko access_token i userInfo
    const tokenCookie = req.cookies.get('access_token')?.value;
    const userInfoCookie = req.cookies.get('userInfo')?.value;

    // Jeśli brakuje userInfo, próbujemy pobrać dane użytkownika z AniList
    if (tokenCookie && !userInfoCookie) {
        try {
            const res = await fetch(ANILIST_USERINFO_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenCookie}`,
                },
                body: JSON.stringify({
                    query: `
                      query {
                        Viewer {
                          id
                          name
                          avatar {
                            large
                          }
                          bannerImage
                        }
                      }
                    `,
                }),
            });

            if (!res.ok) {
                throw new Error(`Błąd HTTP: ${res.status}`);
            }

            const data = await res.json();
            const userData = data.data.Viewer;

            const response = NextResponse.redirect(req.nextUrl);
            response.cookies.set('userInfo', JSON.stringify(userData), { httpOnly: false, secure: true, path: '/', });

            return response;
        } catch (error) {
            console.error("Błąd pobierania danych użytkownika:", error);
            return NextResponse.redirect(new URL('/login', req.url)); // Jeśli błąd, przekierowujemy na stronę logowania
        }
    }

    const isLoginPage = req.nextUrl.pathname.startsWith('/login');


    // Jeśli użytkownik nie ma tokenu i nie jest na stronie logowania, przekierowujemy go na stronę logowania
    if (!tokenCookie && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', req.url)); // Przekierowanie na stronę logowania
    }



    return NextResponse.next();
}

