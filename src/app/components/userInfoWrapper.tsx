"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';


interface User {
    id: number;
    name: string;
    avatar: { large: string }
    bannerImage: string;
}


interface UserContextType {
    userInfo: User | null;
    setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Wrapper dla kontekstu
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        const cookies = new Cookies();
        const savedUserInfo = cookies.get('userInfo');
        if (savedUserInfo) setUserInfo(savedUserInfo);
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};


// Hook do używania kontekstu
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
