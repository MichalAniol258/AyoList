
import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.json({ message: 'Ciasteczko access_token i userInfo zostało usunięte.' });
    response.cookies.set('access_token', '', { maxAge: 0 });
    response.cookies.set('userInfo', '', { maxAge: 0 });
    return response;
}
