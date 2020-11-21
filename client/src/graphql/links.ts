import { from, HttpLink } from "@apollo/client";
import {
    ErrorLink
} from "@apollo/client/link/error";

export const links = from([
    new ErrorLink(({ graphQLErrors, networkError, operation, response }) => {
        if (graphQLErrors)
            graphQLErrors.map( ({ message, locations, path }) =>
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                )
            );
        if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
        uri: '/graphql',
        credentials: "include"
    }),
]);