import * as React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/auth'
import { ApolloProvider } from '@apollo/client'

// grab our tokens and config params for firebase and apollo/FaunaDb
import { firebaseConfig, uiConfig } from './auth/firebase'
import { client } from './database/client'

// import components
import Header from './components/Header'
import Login from './components/Login'
import Profile from './components/Profile'
import Leaderboard from './components/Leaderboard'

// handle creating or updating user document on Fauna
import { manageUser } from './lib/manageUser'

//if (!firebase.app.length) {
// don't try to initialize if already initialized. That's just rude.
firebase.initializeApp(firebaseConfig)
//}

function App() {
   const [isSignedIn, setIsSignedIn] = React.useState(false)
   const [name, setName] = React.useState('')

   function handleLogout() {
      firebase.auth().signOut()
      setName('')
   }

   React.useEffect(() => {
      const unregisterAuthObserver = firebase
         .auth()
         .onAuthStateChanged(user => {
            setIsSignedIn(!!user)
            setName(firebase.auth().currentUser.displayName)
            manageUser({
               uid: firebase.auth().currentUser.uid,
               name: firebase.auth().currentUser.displayName,
               provider: firebase.auth().currentUser.providerData[0].providerId,
            })
         })
      return () => unregisterAuthObserver()
   }, [])

   if (isSignedIn) {
      // TODO remove this once it is being updated
      console.log(firebase.auth().currentUser)
   }
   return (
      <ApolloProvider client={client}>
         <Router>
            <Header
               name={name}
               isSignedIn={isSignedIn}
               handleLogout={handleLogout}
            />

            {!isSignedIn ? (
               <Login uiConfig={uiConfig} />
            ) : (
               <Switch>
                  <Route path="/profile">
                     <Profile />
                  </Route>
                  <Route path="/">
                     <Leaderboard />
                  </Route>
               </Switch>
            )}
         </Router>
      </ApolloProvider>
   )
}

export default App
