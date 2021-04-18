import * as React from 'react'
import { Container, Row } from 'react-bootstrap'
import { ITEMS_QUERY } from '../database/queries-mutations'
import { apolloClient } from '../database/client'

// import components
import Leaderboard from './Leaderboard'
import Loader from './Loader'

function Leaderboards({ userInfo }) {
   const [boards, setBoards] = React.useState([])
   const [loading, setLoading] = React.useState(true)

   React.useEffect(() => {
      apolloClient
         .mutate({
            mutation: ITEMS_QUERY,
         })
         .then(results => {
            setBoards(results.data.allBoards.data)
            setLoading(false)
         })
   }, [])

   if (loading) {
      return <Loader />
   }

   return (
      <Container style={{ marginTop: '70px' }}>
         <h1>El Jeffe Leaderboards</h1>
         <Row noGutters={false}>
            {boards.map(board => {
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
