import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ANILIST_USERINFO_URL = "https://graphql.anilist.co";

export async function middleware(req: NextRequest) {
    // Skip static files
    if (
        req.nextUrl.pathname.startsWith("/_next") ||
        req.nextUrl.pathname.startsWith("/images") ||
        req.nextUrl.pathname.startsWith("/favicons") ||
        req.nextUrl.pathname.startsWith("/public") ||
        req.nextUrl.pathname.startsWith("/api/auth/anilist")
    ) {
        return NextResponse.next();
    }

    const tokenCookie = req.cookies.get('access_token')?.value;
    const userInfoCookie = req.cookies.get('userInfo')?.value;
    const isLoginPage = req.nextUrl.pathname.startsWith('/login');

    // Pobierz userInfo jeśli brakuje
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
                          avatar { large }
                          bannerImage
                        }
                      }
                    `,
                }),
            });

            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

            const data = await res.json();
            const response = NextResponse.redirect(req.nextUrl);

            // POPRAWKA: path: '/' zamiast '/Home'
            response.cookies.set('userInfo', JSON.stringify(data.data.Viewer), {
                httpOnly: false,
                secure: true,
                path: '/'
            });

            return response;
        } catch (error) {
            console.error("Błąd pobierania danych użytkownika:", error);
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    // Główna logika przekierowań
    if (!tokenCookie && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (tokenCookie && isLoginPage) {
        return NextResponse.redirect(new URL('/Home', req.url));
    }

    if (!tokenCookie && req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/login', req.url));
    } else if (tokenCookie && req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/Home', req.url));
    }



    return NextResponse.next();
}

