import * as React from 'react'

function Loader({ size }) {
   return (
      <div className="loader">
         <div className="wrapper">
            <div
               class={`spinner ${
                  size && size === 'small' ? 'small' : 'large'
               } `}
            ></div>

            <span className="sr-only">Loading...</span>
         </div>
      </div>
   )
}

export default Loader
