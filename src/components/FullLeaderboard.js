import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'
import { apolloClient } from '../database/client'
import { useQuery } from '@apollo/react-hooks'
import {
   BOARD_QUERY,
   CREATE_EVENT_FULL,
   CREATE_EVENT_PARTIAL,
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

   function handleSelect(user, type) {
      if (type === 'userDoing') setUserDoing(user._id)
      if (type === 'userReceiving') setUserReceiving(user._id)
      setMessage({ type: 'visually-hidden', text: '' })
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
                  const sortedEvents = results.data.findBoardByID.events.data.sort(
                     (a, b) => {
                        return b.count - a.count
                     }
                  )
                  setEvents(sortedEvents)
               })
            setMessage({ type: 'status', text: 'Saved' })
         })
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
               </Container>
            </Container>
            <span style={{ marginTop: '15px', fontSize: '.9rem' }}>
               Board created by: {board.user.displayName}
            </span>
         </Col>
         <Col style={{ marginTop: '50px' }}>
            <h3>Create a new entry:</h3>
            <div style={{ marginTop: '20px' }}>
               <Form
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     alignItems: 'end',
                  }}
                  onSubmit={handleSubmit}
               >
                  <div style={{ flexGrow: '1' }}>
                     <Form.Group
                        controlId="exampleForm.ControlSelect1"
                        style={{ margin: '0' }}
                     >
                        <Form.Label>Person doing something</Form.Label>
                        <Form.Control as="select">
                           <option
                              onClick={() => handleSelect('', 'userDoing')}
                           ></option>
                           {data
                              ? data.allUsers.data.map(user => {
                                   return (
                                      <option
                                         key={user._id}
                                         id={user._id}
                                         onClick={() =>
                                            handleSelect(user, 'userDoing')
                                         }
                                      >
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
                        padding: '0 15px 8px 15px',
                     }}
                  >
                     {board.action}
                  </div>
                  {board.config ? (
                     <div style={{ flexGrow: '1' }}>
                        <Form.Group
                           controlId="exampleForm.ControlSelect1"
                           style={{ margin: '0' }}
                        >
                           <Form.Label>Person the receiving end</Form.Label>
                           <Form.Control as="select">
                              <option
                                 onClick={() =>
                                    handleSelect('', 'userReceiving')
                                 }
                              ></option>
                              {data
                                 ? data.allUsers.data.map(user => {
                                      return (
                                         <option
                                            key={user._id}
                                            id={user._id}
                                            onClick={() =>
                                               handleSelect(
                                                  user,
                                                  'userReceiving'
                                               )
                                            }
                                         >
                                            {user.displayName}
                                         </option>
                                      )
                                   })
                                 : ''}
                           </Form.Control>
                        </Form.Group>
                     </div>
                  ) : (
                     ''
                  )}
                  <div style={{ padding: '0 0 0 20px' }}>
                     <Button variant="primary" type="submit">
                        Create
                     </Button>
                  </div>
               </Form>
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
         </Col>
      </Container>
   )
}

export default FullLeaderboard
