import * as React from 'react'
import { Container, Spinner } from 'react-bootstrap'

function Loader() {
   return (
      <Container
         style={{
            marginTop: '80px',
            height: '200px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
         }}
      >
         <Spinner animation="border" role="status" size="lg">
            <span className="sr-only">Loading...</span>
         </Spinner>
      </Container>
   )
}

export default Loader
