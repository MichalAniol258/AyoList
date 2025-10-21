
import { ApolloWrapper } from "@/src/app/graphql/ApolloWraper";
import React from "react";


import SessionWrapper from "@/src/app/(main)/components/SessionWrapper";
import { UserProvider } from "@/src/app/(main)/components/userInfoWrapper";
import {QueryProvider} from "@/src/app/(main)/components/queryProvider";
import {BrowseProvider} from "@/src/app/(main)/components/BrowseProvider";
import { UserActivityProvider } from "@/src/app/(main)/components/userActivityWrapper";
import { UserMainProvider } from "@/src/app/(main)/components/userMainWrapper";

import { UserListProvider } from "@/src/app/(main)/components/userListWrapper";
import Nav from "@/src/app/(main)/nav";
import NavPc from "@/src/app/(main)/navPc";
import { memo } from 'react';
const MemoizedNavPc = memo(NavPc);
const MemoizedNav = memo(Nav);


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
      <html lang="en">
      <body>
      <UserProvider>
          <SessionWrapper>
              <ApolloWrapper>
                  <UserActivityProvider>
                      <UserMainProvider>
                          <UserListProvider>
                              <QueryProvider>
                                  <BrowseProvider>
                                      <MemoizedNavPc />
                                      {children}
                                      <MemoizedNav />
                                  </BrowseProvider>
                              </QueryProvider>
                          </UserListProvider>
                      </UserMainProvider>
                  </UserActivityProvider>
              </ApolloWrapper>
          </SessionWrapper>
      </UserProvider>
      </body>
      </html>
  );
}
