import { NextResponse } from "next/server";

const ANILIST_AUTH_URL = "https://anilist.co/api/v2/oauth/authorize";
const ANILIST_CLIENT_ID = process.env.ANILIST_CLIENT_ID;
const ANILIST_REDIRECT_URI = process.env.ANILIST_REDIRECT_URI;

export async function GET() {
    const authorizationUrl = `${ANILIST_AUTH_URL}?client_id=${ANILIST_CLIENT_ID}&redirect_uri=${ANILIST_REDIRECT_URI}&response_type=code`;

    return NextResponse.redirect(authorizationUrl);
}
