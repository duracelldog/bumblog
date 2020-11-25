import { createHttpLink, from, HttpLink, split } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from "@apollo/client/utilities";


const httpLink = new HttpLink({
    uri: '/graphql',
    credentials: "include"
});

// const wsLink = new WebSocketLink({
//     uri: 'ws://localhost:8000/graphql',
//     options: {
//         reconnect: true
//     }
// });

// const splitLink = split(
//     ({ query }) => {
//         const definition = getMainDefinition(query);
//         return (
//             definition.kind === 'OperationDefinition' &&
//             definition.operation === 'subscription'
//         );
//     },
//     wsLink,
//     httpLink,
// )


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
    httpLink,
]);