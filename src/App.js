import * as React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/auth'

// grab our tokens and config params for firebase
import { firebaseConfig, uiConfig } from './auth/firebase'

// import components
import Header from './components/Header'
import Login from './components/Login'
import Profile from './components/Profile'
import Leaderboards from './components/Leaderboards'
import Leaderboard from './components/Leaderboard'

// handle creating or updating user document on Fauna
import { manageUser } from './lib/manageUser'

// don't try to initialize if already initialized. That's just rude.
if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig)
} else {
   firebase.app()
}

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

   return (
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
               <Route path="/leaderboard/:id">
                  <Leaderboard />
               </Route>
               <Route path="/profile">
                  <Profile />
               </Route>
               <Route path="/">
                  <Leaderboards />
               </Route>
            </Switch>
         )}
      </Router>
   )
}

export default App
