import * as React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { FirebaseAuthConsumer } from '@react-firebase/auth'
import config from './config/firebase'

function App() {
  return (
    <FirebaseAuthConsumer firebase={firebase} {...config}>
      {({ isSignedIn, user, providerId }) => {
        return (
          <div>
            <h1>Jeffe Leaderboard</h1>
            <p>
              Track how often Dazed gets run over by friends and other fun
              things.
            </p>
          </div>
        )
      }}
    </FirebaseAuthConsumer>
  )
}

export default App
