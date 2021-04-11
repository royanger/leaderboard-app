import { ApolloClient, InMemoryCache } from '@apollo/client'

const key =
   process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_FAUNA_ITEMEDITOR_KEY
      : process.env.FAUNA_ITEMEDITOR_KEY

export const client = new ApolloClient({
   uri: 'https://graphql.fauna.com/graphql',
   headers: {
      authorization: `Bearer ${key}`,
   },
   cache: new InMemoryCache(),
})
