import * as React from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase/app'
import 'firebase/auth'

//import App from './App'

import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd,
} from '@react-firebase/auth'
import { firebaseConfig } from './config/firebase'

if (~firebase.app.length) {
  console.log('Starting Firebase')
  firebase.initializeApp(firebaseConfig)
}

function App() {
  return (
    //<FirebaseAuthConsumer firebase={firebase} {...config}>
    //{({ isSignedIn, user, providerId }) => {
    //return (
    //  <div>
    //    <h1>Jeffe Leaderboard</h1>
    //    <p>
    //      Track how often Dazed gets run over by friends and other fun things.
    //    </p>
    //  </div>
    //)
    //}}
    //</FirebaseAuthConsumer>
    // )

    <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
      <div>
        <button
          onClick={() => {
            const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(googleAuthProvider)
          }}
        >
          Sign In with Google
        </button>
        <button
          onClick={() => {
            firebase.auth().signOut()
          }}
        >
          Sign Out
        </button>
        <FirebaseAuthConsumer>
          {({ isSignedIn, user, providerId }) => {
            return (
              <pre style={{ height: 300, overflow: 'auto' }}>
                {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
              </pre>
            )
          }}
        </FirebaseAuthConsumer>
        <div>
          <IfFirebaseAuthed>
            {() => {
              return <div>You are authenticated</div>
            }}
          </IfFirebaseAuthed>
          <IfFirebaseAuthedAnd
            filter={({ providerId }) => providerId !== 'anonymous'}
          >
            {({ providerId }) => {
              return <div>You are authenticated with {providerId}</div>
            }}
          </IfFirebaseAuthedAnd>
        </div>
      </div>
    </FirebaseAuthProvider>
  )
}

const root = document.querySelector('#root')
ReactDOM.render(
  //<FirebaseAuthProvider>
  <App />,
  //</FirebaseAuthProvider>,
  root
)
