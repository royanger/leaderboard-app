import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
   uri: 'https://graphql.fauna.com/graphql',
   headers: {
      authorization: `Bearer ${process.env.REACT_APP_FAUNA_ADMIN_KEY}`,
   },
   cache: new InMemoryCache(),
})
