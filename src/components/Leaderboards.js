import * as React from 'react'
import { Container, Row } from 'react-bootstrap'
import { useQuery } from '@apollo/react-hooks'
import { ITEMS_QUERY } from '../database/queries-mutations'

// import components
import LeaderboardItems from './LeaderboardItems'
import Loader from './Loader'

// our base query

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
