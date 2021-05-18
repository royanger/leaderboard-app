import * as React from 'react'

function LeaderboardListItem({ board, onClick, index }) {
   return (
      <div className={`leaderboard-list-item ${index % 2 ? 'odd' : 'even'} `}>
         <div>
            <strong>{board.title}</strong>
         </div>
         <div>{board.description}</div>
         <div className="controls">
            <button onClick={() => onClick(board._id)}>Delete</button>
         </div>
      </div>
   )
}

export default LeaderboardListItem
