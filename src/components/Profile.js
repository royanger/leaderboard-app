import * as React from 'react'
import { Container } from 'react-bootstrap'
import { apolloClient } from '../database/client'
import gql from 'graphql-tag'

const UPDATE_DISPLAY_NAME = gql`
   mutation UpdateDisplayName($id: ID!, $uid: String!, $displayName: String) {
      updateUser(id: $id, data: { uid: $uid, displayName: $displayName }) {
         uid
         name
         displayName
      }
   }
`

function Profile({ userInfo: { _id, uid, name, displayName } }) {
   const [newDisplayName, setNewDisplayName] = React.useState(displayName)
   const [displayNameSaved, setDisplayNameSaved] = React.useState({
      class: 'visually-hidden',
      status: '',
   })

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
         })
   }

   function onDisplayNameChange(e) {
      setNewDisplayName(e.target.value)
      setDisplayNameSaved({
         class: 'visually-hidden',
         status: '',
      })
   }

   return (
      <Container style={{ marginTop: '90px' }}>
         <h2>Profile</h2>

         <form
            onSubmit={handleDisplayNameSubmit}
            style={{
               display: 'inline-block',
               border: '1px solid gray',
               padding: '15px 30px',
               marginTop: '25px',
            }}
         >
            <label
               htmlFor="displayname"
               name="Change Display Name"
               style={{ display: 'block', marginBottom: '0' }}
            >
               <p>Change Display Name</p>
               <input
                  style={{
                     padding: '5px 10px',
                     border: '2px solid #007bff',
                  }}
                  type="text"
                  id="displayname"
                  value={newDisplayName}
                  onChange={onDisplayNameChange}
               />
            </label>
            <span
               style={{ fontSize: '.8rem', height: '.9rem', color: '#198754' }}
               className={displayNameSaved.class}
            >
               Saved
            </span>

            <br />
            <button
               type="submit"
               disabled={displayNameSaved.status}
               className="btn-save"
            >
               Save
            </button>
         </form>
      </Container>
   )
}

export default Profile
