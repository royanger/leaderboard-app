import * as React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

// our base query
const ITEMS_QUERY = gql`
   {
      allItems {
         data {
            _id
            name
         }
      }
   }
`
function LeaderboardItems() {
   const { data, error, loading } = useQuery(ITEMS_QUERY)

   if (loading) {
      return 'Loading...'
   }
   if (error) {
      console.log(error)
   }
   if (!loading) {
      console.log(data)
   }
   return (
      <ul>
         {data.allItems.data.map(item => {
            return <li key={item._id}>{item.name}</li>
         })}
      </ul>
   )
}

export default LeaderboardItems
