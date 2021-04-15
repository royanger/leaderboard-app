import * as React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/auth'

// grab our tokens and config params for firebase
import { firebaseConfig, uiConfig } from './auth/firebase'
import { manageUser } from './lib/manageUser'

// import components
import Header from './components/Header'
import Login from './components/Login'
import Profile from './components/Profile'
import Leaderboards from './components/Leaderboards'
import Leaderboard from './components/Leaderboard'
import Pubg from './components/pubg'

// don't try to initialize if already initialized. That's just rude.
if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig)
} else {
   firebase.app()
}

function App() {
   const [isSignedIn, setIsSignedIn] = React.useState(false)
   const [userInfo, setUserInfo] = React.useState({
      _id: '',
      uid: '',
      name: '',
      displayName: '',
   })

   // clear Firebase and local state, set isSignedIn to false to avoid errors
   function handleLogout() {
      firebase.auth().signOut()
      setIsSignedIn(false)
      setUserInfo('')
   }

   React.useEffect(() => {
      const unregisterAuthObserver = firebase
         .auth()
         .onAuthStateChanged(user => {
            setIsSignedIn(!!user)
            if (isSignedIn) {
               const wrapper = async () => {
                  const results = await manageUser({
                     uid: firebase.auth().currentUser.uid,
                     name: firebase.auth().currentUser.displayName,
                     provider: firebase.auth().currentUser.providerData[0]
                        .providerId,
                  })
                  const { _id, uid, name, displayName } = results
                  setUserInfo({ _id, uid, name, displayName })
               }
               wrapper()
            }
         })
      return () => unregisterAuthObserver()
   }, [isSignedIn])

   return (
      <Router>
         <Header
            name={userInfo}
            isSignedIn={isSignedIn}
            handleLogout={handleLogout}
         />
         {!isSignedIn ? (
            <Login uiConfig={uiConfig} />
         ) : (
            <Switch>
               <Route exact path="/">
                  <Leaderboards />
               </Route>
               <Route exact path="/leaderboard/:id">
                  <Leaderboard />
               </Route>
               <Route exact path="/profile">
                  <Profile userInfo={userInfo} />
               </Route>
               <Route exact path="/pubg">
                  <Pubg />
               </Route>
            </Switch>
         )}
      </Router>
   )
}

export default App
