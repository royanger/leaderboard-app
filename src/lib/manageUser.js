import { apolloClient } from '../database/client'
import gql from 'graphql-tag'

const USER_QUERY = gql`
   query checkUserExists($uid: String!) {
      accountByUid(uid: $uid) {
         data {
            _id
            name
            displayName
            uid
         }
      }
   }
`

const CREATE_USER = gql`
   mutation CreateAUser($uid: String!, $name: String, $provider: String) {
      createUser(
         data: {
            uid: $uid
            name: $name
            displayName: $name
            provider: $provider
         }
      ) {
         uid
         name
         displayName
         provider
         _id
      }
   }
`

export async function manageUser({ uid, name, provider }) {
   const queryResults = await apolloClient.query({
      query: USER_QUERY,
      variables: { uid },
   })

   const { data: checkData, error: checkError } = queryResults

   if (checkError) {
      console.error(checkError)
      return
   }

   if (checkData.accountByUid.data.length === 0) {
      const createResults = await apolloClient.mutate({
         mutation: CREATE_USER,
         variables: {
            uid,
            name,
            provider,
         },
      })

      return createResults.data.createUser
   } else {
      return queryResults.data.accountByUid.data[0]
   }
}
