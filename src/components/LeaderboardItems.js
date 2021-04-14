import * as React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function LeaderboardItems({ board }) {
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
                  style={{ color: '#f8f9fa' }}
               >
                  <h3>Test</h3>
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
               {board.events.data.map(event => {
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
                           <Col xs={10}>
                              {event.userDoing.displayName} {board.action}{' '}
                              {event.userReceiving.displayName}
                           </Col>
                           <Col xs={2}>{event.count}</Col>
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

export default LeaderboardItems
