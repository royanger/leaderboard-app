import * as React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
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
      <Col lg={6}>
         <Container
            style={{
               border: '1px solid gray',
               margin: '20px 0',
               padding: '0 0 20px 0',
            }}
         >
            <Container
               style={{
                  backgroundColor: '#343a40',
                  color: '#f8f9fa',
                  padding: '10px',
               }}
            >
               <LinkContainer
                  to={`/leaderboard/${board._id}`}
                  style={{ color: '#f8f9fa', cursor: 'pointer' }}
               >
                  <h3>{board.title}</h3>
               </LinkContainer>
            </Container>
            <Container
               style={{
                  color: 'f8f9fa',
                  padding: '10px',
                  fontSize: '1.2rem',
               }}
            >
               <p>{board.description}</p>
               {events.map(event => {
                  return (
                     <div
                        key={event._id}
                        style={{
                           borderBottom: '1px solid rgba(52,58,64,.3)',
                           marginBottom: '3px',
                           paddingBottom: '2px',
                        }}
                     >
                        <Row>
                           <Col>
                              {event.userDoing.displayName} {board.action}{' '}
                              {board.config
                                 ? event.userReceiving.displayName
                                 : ''}
                           </Col>
                           <Col xs="auto">
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
                                          handleIncrement(
                                             event._id,
                                             event.count
                                          )
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
                                          handleDecrement(
                                             event._id,
                                             event.count
                                          )
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
                           </Col>
                        </Row>
                     </div>
                  )
               })}
               <span style={{ marginTop: '15px', fontSize: '.9rem' }}>
                  Created By: {board.user.displayName}
               </span>
            </Container>
         </Container>
      </Col>
   )
}

export default Leaderboard
