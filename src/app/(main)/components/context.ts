import {createContext, useContext} from "react";
interface Genre {
    genre: string;
    minutesWatched: number;
    meanScore: number;
    count: number;
}

interface Anime {
    genres: Genre[];
}

interface Manga {
    genres: Genre[];
}

interface Statistics {
    statistics: { anime: Anime; manga: Manga };
}

interface media {
    coverImage: { extraLarge: string, large: string }
    type: string
    genres: string
}
interface entries {
    media: media
}

interface lists {
    entries: entries[]
}

interface MediaListCollection {
    lists: lists[]; // Zmienione na tablicę
}
interface User {
    User: Statistics;
    MediaListCollection: MediaListCollection;
}
interface LayoutContextProps {
    statsData: User;
    statsLoading: boolean
    mediaData: User;
    mediaLoading: boolean
}
export const LayoutContext = createContext<LayoutContextProps | null>(null);

export const useLayoutContext = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("kurwa")
    }
    return context;
}
