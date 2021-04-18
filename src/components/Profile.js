import * as React from 'react'
import { Container } from 'react-bootstrap'
import { apolloClient } from '../database/client'
import {
   BOARDS_QUERY,
   UPDATE_DISPLAY_NAME,
   CREATE_BOARD,
   DELETE_BOARD,
} from '../database/queries-mutations.js'
import { Spinner } from 'react-bootstrap'

// import components
import LeaderboardListItem from './LeaderboardListItem'

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
      // the 'data' returned from the hooks was a pain to work with on re-renders. This is much cleaner
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
         })
   }

   function onBoardChange(e) {
      if (e.target.id === 'title') setTitle(e.target.value)
      if (e.target.id === 'description') setDescription(e.target.value)
      if (e.target.id === 'action') setAction(e.target.value)
   }

   function onClick(e) {
      setConfig(!config)
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
      <>
         <Container style={{ marginTop: '90px' }}>
            <h2>Profile</h2>

            <h3 style={{ fontSize: '1.25rem', marginTop: '40px' }}>
               Change Display Name
            </h3>
            <form
               onSubmit={handleDisplayNameSubmit}
               style={{
                  display: 'inline-block',
                  border: '1px solid gray',
                  padding: '15px 30px',
                  marginTop: '10px',
                  width: '100%',
               }}
            >
               <label
                  htmlFor="displayname"
                  name="Change Display Name"
                  style={{ marginBottom: '0', minWidth: '80%' }}
               >
                  Change the name that is displayed to other users
                  <input
                     style={{
                        padding: '5px 10px',
                        border: '2px solid #007bff',
                        width: '100%',
                        display: 'inline-block',
                     }}
                     type="text"
                     id="displayname"
                     value={newDisplayName}
                     onChange={onDisplayNameChange}
                  />
               </label>
               <button
                  type="submit"
                  disabled={displayNameInfo.status}
                  className="btn-save"
               >
                  Save
               </button>
               <br />
               <span
                  style={{
                     fontSize: '.8rem',
                     height: '.9rem',
                     color: '#198754',
                  }}
                  className={displayNameInfo.class}
               >
                  Saved
               </span>

               <br />
            </form>

            <h3 style={{ fontSize: '1.25rem', marginTop: '40px' }}>
               Add Leaderboard
            </h3>
            <form
               onSubmit={handleBoardCreate}
               style={{
                  display: 'inline-block',
                  border: '1px solid gray',
                  padding: '15px 30px',
                  marginTop: '10px',
                  width: '100%',
               }}
            >
               <label
                  htmlFor="title"
                  name="Leaderboard Title"
                  style={{
                     display: 'block',
                     marginBottom: '0',
                     minWidth: '100%',
                  }}
               >
                  Title
                  <input
                     style={{
                        padding: '5px 10px',
                        border: '2px solid #007bff',
                        width: '100%',
                        marginBottom: '15px',
                     }}
                     type="text"
                     id="title"
                     value={title}
                     onChange={onBoardChange}
                  />
               </label>
               <label
                  htmlFor="description"
                  name="Leaderboard Description"
                  style={{
                     display: 'block',
                     marginBottom: '0',
                     minWidth: '100%',
                  }}
               >
                  Description
                  <input
                     style={{
                        padding: '5px 10px',
                        border: '2px solid #007bff',
                        width: '100%',
                        marginBottom: '15px',
                     }}
                     type="text"
                     id="description"
                     value={description}
                     onChange={onBoardChange}
                  />
               </label>
               <label
                  htmlFor="action"
                  name="Set action for Leaderboard"
                  style={{
                     display: 'block',
                     marginBottom: '0',
                     minWidth: '100%',
                  }}
               >
                  The action that happened
                  <input
                     style={{
                        padding: '5px 10px',
                        border: '2px solid #007bff',
                        width: '100%',
                        marginBottom: '15px',
                     }}
                     type="text"
                     id="action"
                     value={action}
                     onChange={onBoardChange}
                  />
               </label>
               <input
                  type="checkbox"
                  id="action"
                  name="action"
                  value={config}
                  onChange={onClick}
                  style={{ marginTop: '15px' }}
               />
               <label
                  htmlFor="config"
                  name="Configure action"
                  style={{ margin: '15px 0 0 15px' }}
               >
                  Click to make this board a User vs User board. See preview for
                  details.
               </label>

               <div style={{ marginTop: '30px' }}>
                  <strong>Preview:</strong>
                  <br />
                  PlayerUnkown {action ? action : '<empty>'}{' '}
                  {config ? 'WittiestUserNameEver' : ''}
               </div>

               <button
                  type="submit"
                  disabled={displayNameInfo.status}
                  className="btn-add"
               >
                  Add
               </button>
            </form>
         </Container>
         <Container>
            <h3 style={{ fontSize: '1.25rem', marginTop: '40px' }}>
               Existing Leaderboards
            </h3>
            <div
               style={{
                  display: 'inline-block',
                  border: '1px solid gray',
                  padding: '15px 30px',
                  marginTop: '10px',
                  width: '100%',
               }}
            >
               {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                     <Spinner animation="border" role="status" size="lg">
                        <span className="sr-only">Loading...</span>
                     </Spinner>
                  </div>
               ) : (
                  ''
               )}
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
         </Container>
      </>
   )
}

export default Profile
