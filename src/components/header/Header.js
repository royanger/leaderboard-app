import * as React from 'react'
import { Link } from 'react-router-dom'

function Header({ name, isSignedIn, handleLogout }) {
   const [showDropdown, setShowDropdown] = React.useState(false)

   const handleDropdown = e => {
      setShowDropdown(!showDropdown)
   }

   const clearDropdown = e => {
      setShowDropdown(false)
   }

   const logout = e => {
      setShowDropdown(false)
      handleLogout()
   }

   return (
      <header className="header">
         <div className="wrapper">
            <Link to="/" onClick={clearDropdown}>
               <h1>{process.env.REACT_APP_SITE_TITLE}</h1>
            </Link>
            <nav>
               <div>
                  <ul>
                     <li>
                        <Link to="/" onClick={clearDropdown}>
                           Leaderboards
                        </Link>
                     </li>
                     {isSignedIn ? (
                        <div className="dropdown">
                           <li>
                              <button onClick={handleDropdown}>
                                 {name.displayName}
                              </button>
                           </li>
                           <div
                              className={`dropdown-content ${
                                 showDropdown ? 'show' : 'hide'
                              }
                              `}
                           >
                              <Link to="/profile" onClick={clearDropdown}>
                                 Profile
                              </Link>
                              <button onClick={logout}>Logout</button>
                           </div>
                        </div>
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
