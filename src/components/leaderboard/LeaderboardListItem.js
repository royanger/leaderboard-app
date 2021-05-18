import * as React from 'react'

function LeaderboardListItem({ board, onClick, index }) {
   return (
      <div className={`leaderboard-list-item ${index % 2 ? 'odd' : 'even'} `}>
         <div>
            <strong>{board.title}</strong>
         </div>
         <div>{board.description}</div>
         <div className="controls" onClick={() => onClick(board._id)}>
            <svg
               xmlns="http://www.w3.org/2000/svg"
               style={{
                  height: '1.5rem',
                  width: 'auto',
               }}
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
               />
            </svg>
         </div>
      </div>
   )
}

export default LeaderboardListItem
