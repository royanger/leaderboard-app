import * as React from 'react'
import { ITEMS_QUERY } from '../../database/queries-mutations'
import { apolloClient } from '../../database/client'

// import components
import Leaderboard from './Leaderboard'
import Loader from '../loader/Loader'

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
      <>
         <article className="leaderboards">
            <div className="wrapper">
               <h1>All Leaderboards</h1>
               <div className="boards">
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
               </div>
            </div>
         </article>
      </>
   )
}

export default Leaderboards
