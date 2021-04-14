import * as React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from './database/client'

import App from './App'

console.log('key', process.env.REACT_APP_FAUNA_ADMIN_KEY)

const root = document.querySelector('#root')
ReactDOM.render(
   <ApolloProvider client={apolloClient}>
      <App />
   </ApolloProvider>,
   root
)
