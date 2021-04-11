import * as React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import firebase from 'firebase'
import 'firebase/auth'

// grab our tokens and config params for firebase
import { firebaseConfig, uiConfig } from './auth/firebase'

// import components
import Header from './components/Header'
import Login from './components/Login'
import Profile from './components/Profile'
import Leaderboard from './components/Leaderboard'

//if (!firebase.app.length) {
// don't try to initialize if already initialized. That's just rude.
firebase.initializeApp(firebaseConfig)
//}

function App() {
   const [isSignedIn, setIsSignedIn] = React.useState(false)
   const [name, setName] = React.useState('')

   function handleLogout() {
      console.log('CLICKED')
      firebase.auth().signOut()
      setName('')
   }

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
      <Router>
         {console.log('signedin', isSignedIn)}
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
   )
}

export default App
