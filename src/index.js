import * as React from 'react'
import ReactDOM from 'react-dom'

import { ChakraProvider } from '@chakra-ui/react'

import App from './App'

const root = document.querySelector('#root')
ReactDOM.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  root
)
