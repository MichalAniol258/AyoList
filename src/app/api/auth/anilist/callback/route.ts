import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const ANILIST_TOKEN_URL = "https://anilist.co/api/v2/oauth/token";
const ANILIST_USERINFO_URL = "https://graphql.anilist.co";
const ANILIST_CLIENT_ID = process.env.ANILIST_CLIENT_ID;
const ANILIST_CLIENT_SECRET = process.env.ANILIST_CLIENT_SECRET;
const ANILIST_REDIRECT_URI = process.env.ANILIST_REDIRECT_URI;


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ message: 'Authorization code missing' }, { status: 400 });
    }


    try {
        const tokenResponse = await axios.post(
            ANILIST_TOKEN_URL,
            {
                grant_type: 'authorization_code',
                code,
                client_id: ANILIST_CLIENT_ID,
                client_secret: ANILIST_CLIENT_SECRET,
                redirect_uri: ANILIST_REDIRECT_URI
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )

        const { access_token } = tokenResponse.data;

        const userResponse = await axios.post(
            ANILIST_USERINFO_URL,
            {
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
            },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        )

        const { userInfo } = userResponse.data;

        const response = NextResponse.redirect(new URL('/', req.url));

        response.cookies.set('access_token', access_token, { httpOnly: false, secure: true, maxAge: 10 * 365 * 24 * 60 * 60 * 1000 })
        response.cookies.set('userInfo', userInfo, { httpOnly: false, secure: true, maxAge: 10 * 365 * 24 * 60 * 60 * 1000 })
        return response
    } catch (error) {
        console.error("Anilist OAuth error:", error);
        return NextResponse.json({ error: "Authentication Failed" }, { status: 500 })
    }
}