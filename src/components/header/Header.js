import * as React from 'react'
import { Link } from 'react-router-dom'

function Header({ name, isSignedIn, handleLogout }) {
   const [showDropdown, setShowDropdown] = React.useState(false)

   const handleDropdown = e => {
      setShowDropdown(!showDropdown)
   }

   const logout = e => {
      setShowDropdown(false)
      handleLogout()
   }

   return (
      <header className="header">
         <div className="wrapper">
            <Link to="/">
               <h1>{process.env.REACT_APP_SITE_TITLE}</h1>
            </Link>
            <nav>
               <div>
                  <ul>
                     {isSignedIn ? (
                        <>
                           <li>
                              <Link to="/profile">
                                 <button>
                                    {/* {name.displayName} */}
                                    Profile / Add Leaderboard
                                 </button>
                              </Link>
                           </li>
                           <li>
                              <button onClick={logout}>Logout</button>
                           </li>
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
