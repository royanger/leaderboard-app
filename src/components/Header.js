import * as React from 'react'
import { Container, Row, Col, Navbar } from 'react-bootstrap'

function Header({ name }) {
   console.log('NAME', name)
   return (
      <header>
         <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
            <Navbar.Brand>Jeffe's Leaderboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
               {name ? <p>{name}</p> : 'Not signed in'}
            </Navbar.Collapse>
         </Navbar>
      </header>
   )
}

export default Header
