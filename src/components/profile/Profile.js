import * as React from 'react'
import { apolloClient } from '../../database/client'
import {
   BOARDS_QUERY,
   UPDATE_DISPLAY_NAME,
   CREATE_BOARD,
   DELETE_BOARD,
} from '../../database/queries-mutations.js'
import { Spinner } from 'react-bootstrap'

// import components
import LeaderboardListItem from '../leaderboard/LeaderboardListItem'

function Profile({
   userInfo: { _id, uid, name, displayName },
   updateDisplayNameInState,
}) {
   // some state for the display name form
   const [newDisplayName, setNewDisplayName] = React.useState(displayName)
   const [displayNameInfo, setDisplayNameSaved] = React.useState({
      class: 'visually-hidden',
      status: '',
   })

   // some state for the add leaderboards and leaderboard form
   const [leaderboards, setLeaderboards] = React.useState([])
   const [title, setTitle] = React.useState('')
   const [description, setDescription] = React.useState('')
   const [action, setAction] = React.useState('')
   const [config, setConfig] = React.useState(false)
   const [loading, setLoading] = React.useState(false)
   const [checked, setChecked] = React.useState(false)

   const loadLeaderboards = React.useCallback(() => {
      setLoading(true)
      setLeaderboards([])
      // make sure the user data has loaded from prop before running the query, or it will error
      // error would happen on reload / direct link to route/page
      if (_id) {
         apolloClient
            .mutate({
               mutation: BOARDS_QUERY,
               variables: {
                  id: _id,
               },
            })
            .then(results => {
               setLeaderboards(results.data.findUserByID.boards.data)
               setLoading(false)
            })
      }
   }, [_id])

   React.useEffect(() => {
      loadLeaderboards()
   }, [loadLeaderboards])

   function handleDisplayNameSubmit(e) {
      e.preventDefault()
      // the 'data' returned from the Apollo Client hooks was a pain to work with on re-renders. This is much cleaner
      apolloClient
         .mutate({
            mutation: UPDATE_DISPLAY_NAME,
            variables: {
               uid,
               displayName: newDisplayName,
               id: _id,
            },
         })
         .then(results => {
            setDisplayNameSaved({
               class: '',
               status: 'disabled',
            })
            updateDisplayNameInState(newDisplayName)
         })
   }

   function onDisplayNameChange(e) {
      setNewDisplayName(e.target.value)
      setDisplayNameSaved({
         class: 'visually-hidden',
         status: '',
      })
   }

   function handleBoardCreate(e) {
      e.preventDefault()
      const id = _id

      apolloClient
         .mutate({
            mutation: CREATE_BOARD,
            variables: {
               id,
               title,
               description,
               config,
               action,
            },
         })
         .then(results => {
            loadLeaderboards()
            setTitle('')
            setDescription('')
            setAction('')
            setConfig(false)
            setChecked(false)
         })
   }

   function onBoardChange(e) {
      if (e.target.id === 'title') setTitle(e.target.value)
      if (e.target.id === 'description') setDescription(e.target.value)
      if (e.target.id === 'action') setAction(e.target.value)
   }

   function onClick(e) {
      setConfig(!config)
      setChecked(!checked)
   }

   function deleteBoard(id) {
      apolloClient
         .mutate({
            mutation: DELETE_BOARD,
            variables: {
               id: id,
            },
         })
         .then(results => {
            loadLeaderboards()
         })
   }

   return (
      <div className="profile-page">
         <div className="wrapper">
            <div className="profile">
               <h1>Profile</h1>

               <div className="display-name">
                  <h3>Change Display Name</h3>
                  <form onSubmit={handleDisplayNameSubmit}>
                     <label htmlFor="displayname" name="Change Display Name">
                        Change the name that is displayed to other users
                        <input
                           type="text"
                           id="displayname"
                           value={newDisplayName}
                           onChange={onDisplayNameChange}
                        />
                     </label>
                     <button type="submit" disabled={displayNameInfo.status}>
                        Save
                     </button>
                     <br />
                     <span className={`${displayNameInfo.class} save`}>
                        Saved
                     </span>

                     <br />
                  </form>
               </div>
               <div className="create-leaderboard">
                  <h3>Add Leaderboard</h3>
                  <form onSubmit={handleBoardCreate}>
                     <label htmlFor="title" name="Leaderboard Title">
                        Title
                        <input
                           type="text"
                           id="title"
                           value={title}
                           onChange={onBoardChange}
                        />
                     </label>
                     <label
                        htmlFor="description"
                        name="Leaderboard Description"
                     >
                        Description
                        <input
                           type="text"
                           id="description"
                           value={description}
                           onChange={onBoardChange}
                        />
                     </label>
                     <label htmlFor="action" name="Set action for Leaderboard">
                        The action that happened
                        <input
                           type="text"
                           id="action"
                           value={action}
                           onChange={onBoardChange}
                        />
                     </label>

                     <div className="checkbox">
                        <input
                           type="checkbox"
                           id="action"
                           name="action"
                           checked={checked}
                           value={config}
                           onChange={onClick}
                        />

                        <label htmlFor="config" name="Configure action">
                           <span className="indicator" onClick={onClick}></span>
                           Click to make this board a User vs User board. See
                           preview for details.
                        </label>
                     </div>

                     <div style={{ marginTop: '30px' }}>
                        <strong>Preview:</strong>
                        <br />
                        Trae {action ? action : '<empty>'}{' '}
                        {config ? 'Dazed898' : ''}
                     </div>

                     <button
                        type="submit"
                        disabled={displayNameInfo.status}
                        className="btn-add"
                     >
                        Add
                     </button>
                  </form>
               </div>

               <div className="owned-leaderboards">
                  <h3>Existing Leaderboards</h3>

                  <div>
                     {loading ? (
                        <div
                           style={{ display: 'flex', justifyContent: 'center' }}
                        >
                           <Spinner animation="border" role="status" size="lg">
                              <span className="sr-only">Loading...</span>
                           </Spinner>
                        </div>
                     ) : (
                        ''
                     )}

                     {leaderboards ? 'ASDFASFDSADF' : 'adsfdasdf'}

                     {leaderboards
                        ? leaderboards.map(board => {
                             return (
                                <LeaderboardListItem
                                   key={board._id}
                                   board={board}
                                   onClick={deleteBoard}
                                />
                             )
                          })
                        : ''}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Profile
