"use client";
import { HttpLink } from "@apollo/client";
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";

import { getCookie } from 'cookies-next'
function makeClient() {
    // Odczytanie ciasteczka z tokenem


    const httpLink = new HttpLink({
        uri: "/graphql"
    });

    const authLink = setContext((_, { headers }) => {
        // Odczytaj token z ciasteczka
        const token = getCookie("access_token");
        // Zwróć nagłówki z dołączonym tokenem
        return {
            headers: {
                ...headers,
                authorization: token && `Bearer ${token}`,
            },
        };
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink),
    });
}

export function ApolloWrapper({ children }) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>

                        {children}

        </ApolloNextAppProvider>
    );
}
