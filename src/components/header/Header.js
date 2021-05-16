import * as React from 'react'
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function Header({ name, isSignedIn, handleLogout }) {
   return (
      <div className="wrapper">
         <header className="header">
            <LinkContainer to="/">
               <brand>{process.env.REACT_APP_SITE_TITLE}</brand>
            </LinkContainer>
            <nav>
               <div>
                  <LinkContainer to="/">
                     <Nav.Link>Leaderboards</Nav.Link>
                  </LinkContainer>

                  {isSignedIn ? (
                     <>
                        <span>{name.displayName}</span>
                        <LinkContainer to="/profile">
                           <NavDropdown.Item>Profile</NavDropdown.Item>
                        </LinkContainer>
                        <button onClick={handleLogout}>Logout</button>
                     </>
                  ) : (
                     ''
                  )}
               </div>
            </nav>
         </header>
      </div>
   )
}

export default Header
