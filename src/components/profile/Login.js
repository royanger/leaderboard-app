import * as React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

function Login({ uiConfig, firebaseAuth }) {
   return (
      <>
         <div className="login">
            <h1>Sign In/Register</h1>
            <StyledFirebaseAuth
               uiConfig={uiConfig}
               firebaseAuth={firebase.auth()}
            />
         </div>
      </>
   )
}

export default Login
