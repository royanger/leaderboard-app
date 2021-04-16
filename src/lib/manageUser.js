import { apolloClient } from '../database/client'
import { CREATE_USER, USER_QUERY } from '../database/queries-mutations'

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
