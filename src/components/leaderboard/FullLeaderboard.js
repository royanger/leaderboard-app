import * as React from 'react'
import { useParams } from 'react-router-dom'
import { apolloClient } from '../../database/client'
import { useQuery } from '@apollo/react-hooks'
import {
   BOARD_QUERY,
   CREATE_EVENT_FULL,
   CREATE_EVENT_PARTIAL,
   EVENTS_QUERY,
   FIND_USERS_QUERY,
   UPDATE_EVENT_COUNT,
} from '../../database/queries-mutations.js'

// import components
import Loader from '../loader/Loader'

function FullLeaderboard({ userInfo: { _id, name, displayName } }) {
   const { id } = useParams()
   const [loading, setLoading] = React.useState(true)
   const [board, setBoard] = React.useState('')
   const [events, setEvents] = React.useState([])
   const { data } = useQuery(FIND_USERS_QUERY)
   const [userDoing, setUserDoing] = React.useState('')
   const [userReceiving, setUserReceiving] = React.useState('')
   const [message, setMessage] = React.useState({
      type: 'visually-hidden',
      text: '',
   })

   // console.log(board.config)

   React.useEffect(() => {
      apolloClient
         .mutate({
            mutation: BOARD_QUERY,
            variables: {
               id,
            },
         })
         .then(results => {
            setBoard(results.data.findBoardByID)
            const tempEvents = [...results.data.findBoardByID.events.data]
            const sortedEvents = tempEvents.sort((a, b) => {
               return b.count - a.count
            })
            setEvents(sortedEvents)
            setLoading(false)
         })
   }, [id])

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
      console.log('increment', id, count)
      updateEventCount(id, count + 1)
   }

   function handleDecrement(id, count) {
      console.log('decrement', id, count)
      updateEventCount(id, count - 1)
   }

   function handleSubmit(e) {
      e.preventDefault()
      setMessage({ type: 'status', text: 'Saving' })

      if (board.config) {
         if (!userDoing || !userReceiving) {
            console.log('form not complete')
            setMessage({ type: 'error', text: 'Please select both users' })
            return
         }
      } else {
         if (!userDoing) {
            console.log('form not complete')
            setMessage({ type: 'error', text: 'Please select both users' })
            return
         }
      }

      // can't find a way to pass a default value for a variable
      // used two queries -- don't love this solution
      const query = board.config ? CREATE_EVENT_FULL : CREATE_EVENT_PARTIAL

      apolloClient
         .mutate({
            mutation: query,
            variables: {
               board: board._id,
               userDoing: userDoing,
               userReceiving: userReceiving,
               count: 1,
            },
         })
         .then(results => {
            console.log(results)
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
            setMessage({ type: 'status', text: 'Saved' })
         })
   }

   if (loading) {
      return <Loader />
   }

   return (
      <article className="leaderboard">
         <div className="wrapper">
            <h1>{board.title}</h1>
            <p className="info">{board.description}</p>
            <div className="board">
               <div className="title">
                  <div>
                     <h2>Action</h2>
                  </div>
                  <div>
                     <h2>Count</h2>
                  </div>
               </div>

               {events.map((event, i) => {
                  return (
                     <div
                        key={event._id}
                        className={`entry ${i % 2 ? 'odd' : 'even'}`}
                     >
                        <div>
                           {event.userDoing.displayName} {board.action}{' '}
                           {board.config ? event.userReceiving.displayName : ''}
                        </div>
                        <div>
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
                     </div>
                  )
               })}
            </div>
            <span className="info small">Owner: {board.user.displayName}</span>
            <div className="create-new">
               <h3>Create a new entry:</h3>

               <div className="form">
                  <form className="addevent" onSubmit={handleSubmit}>
                     <label htmlFor="userDoingList" className="visually-hidden">
                        Person doing something
                     </label>
                     <select
                        id="userDoingList"
                        onChange={e => {
                           setUserDoing(
                              e.target.options[e.target.options.selectedIndex]
                                 .id
                           )
                        }}
                     >
                        <option id=""></option>
                        {data
                           ? data.allUsers.data.map(user => {
                                return (
                                   <option key={user._id} id={user._id}>
                                      {user.displayName}
                                   </option>
                                )
                             })
                           : ''}
                     </select>

                     <div className="action">
                        <p>{board.action}</p>
                     </div>
                     {board.config ? (
                        <>
                           <label
                              htmlFor="userReceivingList"
                              className="visually-hidden"
                           >
                              Person the receiving end
                           </label>
                           <select
                              id="userReceivingList"
                              onChange={e => {
                                 setUserReceiving(
                                    e.target.options[
                                       e.target.options.selectedIndex
                                    ].id
                                 )
                              }}
                           >
                              <option id=""></option>
                              {data
                                 ? data.allUsers.data.map(user => {
                                      return (
                                         <option key={user._id} id={user._id}>
                                            {user.displayName}
                                         </option>
                                      )
                                   })
                                 : ''}
                           </select>
                        </>
                     ) : (
                        ''
                     )}
                     <div style={{ padding: '0 0 0 20px' }}>
                        <button>Create</button>
                     </div>
                  </form>
                  <span
                     style={{
                        fontSize: '.8rem',
                        height: '.9rem',
                     }}
                     className={message.type}
                  >
                     {message.text}
                  </span>
               </div>
            </div>
         </div>
      </article>
   )
}

export default FullLeaderboard
