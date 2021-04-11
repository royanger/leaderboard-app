import * as React from 'react'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function Header({ name, isSignedIn, handleLogout }) {
   console.log('NAME', name)
   console.log('Signed In', isSignedIn)
   return (
      <header>
         <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
            <LinkContainer to="/">
               <Navbar.Brand>Jeffe's Leaderboard</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="ml-auto">
                  {isSignedIn ? (
                     <NavDropdown title={name} id="username">
                        <LinkContainer to="/profile">
                           <NavDropdown.Item>Profile</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item onClick={handleLogout}>
                           Logout
                        </NavDropdown.Item>
                     </NavDropdown>
                  ) : (
                     ''
                  )}
               </Nav>
            </Navbar.Collapse>
         </Navbar>
      </header>
   )
}

export default Header
