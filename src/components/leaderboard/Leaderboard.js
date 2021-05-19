import * as React from 'react'
import { Link } from 'react-router-dom'
import { apolloClient } from '../../database/client'
import {
   EVENTS_QUERY,
   UPDATE_EVENT_COUNT,
} from '../../database/queries-mutations.js'

function Leaderboard({ board, userInfo: { _id, name, displayName } }) {
   const [events, setEvents] = React.useState([])

   React.useEffect(() => {
      if (board.events.data[0] && board.events.data.length > 1) {
         const tempEvents = [...board.events.data]
         const sortedEvents = tempEvents.sort((a, b) => {
            return b.count - a.count
         })
         setEvents(sortedEvents)
      }
   }, [board.events.data])

   function updateEventCount(id, count) {
      apolloClient
         .mutate({
            mutation: UPDATE_EVENT_COUNT,
            variables: {
               id,
               count,
            },
         })
         .then(results => {
            apolloClient
               .mutate({
                  mutation: EVENTS_QUERY,
                  variables: {
                     id: board._id,
                  },
               })
               .then(results => {
                  const sortedEvents =
                     results.data.findBoardByID.events.data.sort((a, b) => {
                        return b.count - a.count
                     })
                  setEvents(sortedEvents)
               })
         })
   }

   function handleIncrement(id, count) {
      updateEventCount(id, count + 1)
   }

   function handleDecrement(id, count) {
      updateEventCount(id, count - 1)
   }

   return (
      <div className="board">
         <div className="title">
            <Link to={`/leaderboard/${board._id}`}>
               <h3>{board.title}</h3>
            </Link>
         </div>

         <div className="info">
            <p>{board.description}</p>
         </div>

         <div className="records">
            {events.map((event, i) => {
               return (
                  <div
                     key={event._id}
                     className={i % 2 ? 'record odd' : 'record even'}
                  >
                     <div className="action">
                        {event.userDoing.displayName} {board.action}{' '}
                        {board.config ? event.userReceiving.displayName : ''}
                     </div>
                     <div className="controls">
                        {_id === event.userDoing._id ||
                        (event.userReceiving &&
                           _id === event.userReceiving._id) ? (
                           <div className="buttons">
                              <button
                                 className="increment"
                                 onClick={() =>
                                    handleIncrement(event._id, event.count)
                                 }
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth="2"
                                       d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                 </svg>
                              </button>
                              <button
                                 className="decrement"
                                 onClick={() =>
                                    handleDecrement(event._id, event.count)
                                 }
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth="2"
                                       d="M20 12H4"
                                    />
                                 </svg>
                              </button>
                           </div>
                        ) : (
                           ''
                        )}
                        {event.count}
                     </div>

                     <div className="buttons"></div>
                  </div>
               )
            })}
         </div>

         <div className="info small">Owner: {board.user.displayName}</div>
         <div className="footer">
            <Link to={`/leaderboard/${board._id}`}>
               View full leaderboard
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
               >
                  <path
                     fillRule="evenodd"
                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                     clipRule="evenodd"
                  />
               </svg>
            </Link>
         </div>
      </div>
   )
}

export default Leaderboard
