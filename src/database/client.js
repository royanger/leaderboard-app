import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// const httpLink = createHttpLink({
//    uri: 'https://graphql.fauna.com/graphql',
// })

// const authLink = setContext((_, { headers }) => {
//    return {
//       headers: {
//          ...headers,
//          authorization: `Bearer ${process.env.REACT_APP_FAUNA_ITEMEDITOR_KEY}`,
//       }
//    }
// })

export const client = new ApolloClient({
   uri: 'https://graphql.fauna.com/graphql',
   headers: {
      authorization: `Bearer ${process.env.REACT_APP_FAUNA_ITEMEDITOR_KEY}`,
   },
   cache: new InMemoryCache(),
})
