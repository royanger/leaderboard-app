import * as React from 'react'
import { Container, Row } from 'react-bootstrap'
import { useQuery } from '@apollo/react-hooks'
import { ITEMS_QUERY } from '../database/queries-mutations'

// import components
import Leaderboard from './Leaderboard'
import Loader from './Loader'

// our base query

function Leaderboards({ userInfo }) {
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
               return (
                  <Leaderboard
                     key={board._id}
                     board={board}
                     userInfo={userInfo}
                     standalone={false}
                  />
               )
            })}
         </Row>
      </Container>
   )
}

export default Leaderboards
