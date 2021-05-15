import firebase from 'firebase/app'
import 'firebase/auth'

export const firebaseConfig = {
   apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
   authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
   projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
   storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
   appId: process.env.REACT_APP_FIREBASE_APPID,
   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
}

export const uiConfig = {
   signInFlow: 'popup',
   callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
   },
   signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
}
