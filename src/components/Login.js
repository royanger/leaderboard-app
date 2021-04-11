import * as React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

function Login({ uiConfig, firebaseAuth }) {
   return (
      <>
         <div>
            <h2>This is a test.</h2>
            <StyledFirebaseAuth
               uiConfig={uiConfig}
               firebaseAuth={firebase.auth()}
            />
         </div>
      </>
   )
}

export default Login
