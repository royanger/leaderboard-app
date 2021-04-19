import * as React from 'react'
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function Header({ name, isSignedIn, handleLogout }) {
   return (
      // <header>
      <Navbar
         bg="primary"
         variant="dark"
         expand="lg"
         fixed="top"
         as="header"
         collapseOnSelect
      >
         <Container>
            <LinkContainer to="/">
               <Navbar.Brand>Jeffe's Leaderboards</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="ml-auto">
                  <LinkContainer to="/">
                     <Nav.Link>Leaderboards</Nav.Link>
                  </LinkContainer>
                  {/* <LinkContainer to="/pubg">
                     <Nav.Link>PUBG</Nav.Link>
                  </LinkContainer> */}
                  {isSignedIn ? (
                     <NavDropdown title={name.displayName} id="username">
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
         </Container>
      </Navbar>
      // </header>
   )
}

export default Header
