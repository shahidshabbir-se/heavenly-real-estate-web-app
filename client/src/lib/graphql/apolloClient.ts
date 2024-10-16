import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8080/graphql', // Your backend GraphQL API URL
    credentials: 'include', // Include cookies in requests
  }),
  cache: new InMemoryCache(),
});

export default client;
