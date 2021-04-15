import * as React from 'react'
import { Container, Row } from 'react-bootstrap'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

// import components
import LeaderboardItems from './LeaderboardItems'
import Loader from './Loader'

// our base query
const ITEMS_QUERY = gql`
   {
      allBoards {
         data {
            _id
            title
            description
            config
            action
            user {
               _id
               name
               displayName
            }
            events {
               data {
                  _id
                  userDoing {
                     _id
                     displayName
                  }
                  userReceiving {
                     _id
                     displayName
                  }
                  count
               }
            }
         }
      }
   }
`

function Leaderboard() {
   const { data, error, loading } = useQuery(ITEMS_QUERY)

   if (loading) {
      return <Loader />
   }
   if (error) {
      console.log(error)
   }

   return (
      <Container style={{ marginTop: '70px' }}>
         <h1>El Jeffe Leaderboards</h1>
         <Row noGutters={false}>
            {data.allBoards.data.map(board => {
               return <LeaderboardItems key={board._id} board={board} />
            })}
         </Row>
      </Container>
   )
}

export default Leaderboard
