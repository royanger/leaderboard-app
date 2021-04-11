import firebase from 'firebase/app'
import 'firebase/auth'

export const firebaseConfig = {
   apiKey: 'AIzaSyD5GC3l1SZCoryXvpiolwP_VvTTtmLRRYg',
   authDomain: 'jeffe-leaderboard.firebaseapp.com',
   projectId: 'jeffe-leaderboard',
   storageBucket: 'jeffe-leaderboard.appspot.com',
   messagingSenderId: '470561412339',
   appId: '1:470561412339:web:79fc0913e8d9c91e51d386',
   measurementId: 'G-YC1WM21DX2',
}

export const uiConfig = {
   signInFlow: 'popup',
   callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
   },
   signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
}
