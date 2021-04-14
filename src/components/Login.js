import * as React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { Container } from 'react-bootstrap'

function Login({ uiConfig, firebaseAuth }) {
   return (
      <>
         <Container
            style={{
               marginTop: '120px',
            }}
         >
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>
               Sign In/Register
            </h2>
            <StyledFirebaseAuth
               uiConfig={uiConfig}
               firebaseAuth={firebase.auth()}
            />
         </Container>
      </>
   )
}

export default Login
