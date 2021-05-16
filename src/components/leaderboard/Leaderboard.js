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
                     <div className="count">
                        {event.count}
                        {_id === event.userDoing._id ||
                        (event.userReceiving &&
                           _id === event.userReceiving._id) ? (
                           <>
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 style={{
                                    height: '1.35rem',
                                    width: 'auto',
                                    marginLeft: '5px',
                                    color: '#198754',
                                 }}
                                 onClick={() =>
                                    handleIncrement(event._id, event.count)
                                 }
                                 viewBox="0 0 20 20"
                                 fill="currentColor"
                              >
                                 <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                    clipRule="evenodd"
                                 />
                              </svg>
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 style={{
                                    height: '1.35rem',
                                    width: 'auto',
                                    color: 'red',
                                 }}
                                 onClick={() =>
                                    handleDecrement(event._id, event.count)
                                 }
                                 viewBox="0 0 20 20"
                                 fill="currentColor"
                              >
                                 <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                                    clipRule="evenodd"
                                 />
                              </svg>
                           </>
                        ) : (
                           ''
                        )}
                     </div>

                     <div className="buttons"></div>
                  </div>
               )
            })}
         </div>

         <div className="info small">Owner: {board.user.displayName}</div>
      </div>
   )
}

export default Leaderboard
