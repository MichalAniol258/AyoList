"use client"
import { signIn } from 'next-auth/react';

export default function Chuj() {
    return (
        <div>
            <button onClick={() => signIn('anilist')}>Zaloguj się przez AniList</button>
        </div>
    );
}
