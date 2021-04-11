import * as React from 'react'
import firebase from 'firebase'
import 'firebase/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

// grab our tokens and config params for firebase
import { firebaseConfig, uiConfig } from './auth/firebase'

// import components
import Header from './components/Header'
import Login from './components/Login'

if (!firebase.app.length) {
   // don't try to initialize if already initialized. That's just rude.
   firebase.initializeApp(firebaseConfig)
}

function App() {
   const [isSignedIn, setIsSignedIn] = React.useState(false)
   const [name, setName] = React.useState('')

   React.useEffect(() => {
      const unregisterAuthObserver = firebase
         .auth()
         .onAuthStateChanged(user => {
            setIsSignedIn(!!user)
            setName(firebase.auth().currentUser.displayName)
         })
      return () => unregisterAuthObserver()
   }, [])

   if (isSignedIn) {
      console.log(firebase.auth().currentUser.uid)
   }
   return (
      <>
         <Header name={name} />

         <div>
            {isSignedIn ? (
               <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
            ) : (
               <Login uiConfig={uiConfig} />
            )}
         </div>
      </>
   )
}

export default App
