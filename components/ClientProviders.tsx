

import React from "react";
import SessionWrapper from '@/src/app/(main)/components/SessionWrapper';
import { ApolloWrapper } from '@/src/app/graphql/ApolloWraper';
import { UserProvider } from '@/src/app/(main)/components/userInfoWrapper';

import {BrowseProvider} from "@/src/app/(main)/components/BrowseProvider";
import {QueryProvider} from "@/src/app/(main)/components/queryProvider";



import dynamic from "next/dynamic";



const Nav = dynamic(() => import("@/src/app/(main)/nav"), { ssr: false });

const NavPc = dynamic(() => import("@/src/app/(main)/navPc"), { ssr: false });

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <SessionWrapper>
                <ApolloWrapper>
                    <UserProvider>
                        <BrowseProvider>
                            <QueryProvider>
                                <Nav />
                                <NavPc />

                                {/* inne providery */}
                                {children}
                            </QueryProvider>
                        </BrowseProvider>
                    </UserProvider>
                </ApolloWrapper>
            </SessionWrapper>
        </UserProvider>
    );
}
