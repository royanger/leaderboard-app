import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import { apolloClient } from '../database/client'
import { useQuery } from '@apollo/react-hooks'
import {
   BOARD_QUERY,
   EVENTS_QUERY,
   FIND_USERS_QUERY,
   UPDATE_EVENT_COUNT,
} from '../database/queries-mutations.js'

// import components
import Loader from './Loader'

function FullLeaderboard({ userInfo: { _id, name, displayName } }) {
   const { id } = useParams()
   const [loading, setLoading] = React.useState(true)
   const [board, setBoard] = React.useState('')
   const [events, setEvents] = React.useState([])
   const { loading: usersLoading, error, data } = useQuery(FIND_USERS_QUERY)

   console.log(data.allUsers.data)

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
                  const sortedEvents = results.data.findBoardByID.events.data.sort(
                     (a, b) => {
                        return b.count - a.count
                     }
                  )
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

   if (loading) {
      return <Loader />
   }

   return (
      <Container style={{ marginTop: '90px' }}>
         <h3>{board.title}</h3>
         <p>{board.description}</p>

         <Col lg={12} style={{ padding: '0' }}>
            <Container
               style={{
                  border: '1px solid gray',
                  margin: '20px 0',
                  padding: '0 0 20px 0',
               }}
            >
               <Container
                  style={{
                     color: 'f8f9fa',
                     padding: '0 10px 10px 10px',
                     fontSize: '1.2rem',
                  }}
               >
                  <Row
                     style={{
                        backgroundColor: '#343a40',
                        color: '#f8f9fa',
                        padding: '10px',
                        margin: '0 -10px 20px',
                     }}
                  >
                     <Col>Test</Col>
                     <Col xs="auto">Count</Col>
                  </Row>
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
                           <Row
                              style={{
                                 color: '#343a40',
                              }}
                           >
                              <Col>
                                 {event.userDoing.displayName} {board.action}{' '}
                                 {event.userReceiving.displayName}
                              </Col>
                              <Col xs="auto">
                                 {event.count}
                                 {_id === event.userDoing._id ||
                                 _id === event.userReceiving._id ? (
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
               </Container>
            </Container>
            <span style={{ marginTop: '15px', fontSize: '.9rem' }}>
               Created By: {board.user.displayName}
            </span>
         </Col>
         <Col>
            <h3>Create a new entry:</h3>
            <div
               style={{
                  border: '1px solid red',
               }}
            >
               <Form
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     alignItems: 'end',
                  }}
               >
                  <div style={{ border: '1px solid red', flexGrow: '1' }}>
                     <Form.Group
                        controlId="exampleForm.ControlSelect1"
                        style={{ margin: '0' }}
                     >
                        <Form.Label>Person doing something</Form.Label>
                        <Form.Control as="select">
                           {data
                              ? data.allUsers.data.map(user => {
                                   return (
                                      <option key={user._id}>
                                         {user.displayName}
                                      </option>
                                   )
                                })
                              : ''}
                        </Form.Control>
                     </Form.Group>
                  </div>
                  <div
                     style={{
                        border: '1px solid red',
                        padding: '0 15px 8px 15px',
                     }}
                  >
                     {board.action}
                  </div>
                  <div style={{ border: '1px solid red', flexGrow: '1' }}>
                     <Form.Group
                        controlId="exampleForm.ControlSelect1"
                        style={{ margin: '0' }}
                     >
                        <Form.Label>Example select</Form.Label>
                        <Form.Control as="select">
                           {data
                              ? data.allUsers.data.map(user => {
                                   return (
                                      <option key={user._id}>
                                         {user.displayName}
                                      </option>
                                   )
                                })
                              : ''}
                        </Form.Control>
                     </Form.Group>
                  </div>
                  <div
                     style={{ border: '1px solid red', padding: '0 0 0 20px' }}
                  >
                     <Button variant="primary" type="submit">
                        Submit
                     </Button>
                  </div>
               </Form>
            </div>
         </Col>
      </Container>
   )
}

export default FullLeaderboard
