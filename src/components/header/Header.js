import * as React from 'react'
import { Link } from 'react-router-dom'

function Header({ name, isSignedIn, handleLogout }) {
   return (
      <header className="header">
         <div className="wrapper">
            <Link to="/">
               <brand>{process.env.REACT_APP_SITE_TITLE}</brand>
            </Link>
            <nav>
               <div>
                  <ul>
                     <li>
                        <Link to="/">Leaderboards</Link>
                     </li>
                     {isSignedIn ? (
                        <>
                           <li>
                              <span>{name.displayName}</span>
                           </li>
                           <div className="dropdown">
                              <Link to="/profile">Profile</Link>
                              <button onClick={handleLogout}>Logout</button>
                           </div>
                        </>
                     ) : (
                        ''
                     )}
                  </ul>
               </div>
            </nav>
         </div>
      </header>
   )
}

export default Header
