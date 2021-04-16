import gql from 'graphql-tag'

export const USER_QUERY = gql`
   query checkUserExists($uid: String!) {
      accountByUid(uid: $uid) {
         data {
            _id
            name
            displayName
            uid
         }
      }
   }
`

export const CREATE_USER = gql`
   mutation CreateAUser($uid: String!, $name: String, $provider: String) {
      createUser(
         data: {
            uid: $uid
            name: $name
            displayName: $name
            provider: $provider
         }
      ) {
         uid
         name
         displayName
         provider
         _id
      }
   }
`

export const BOARDS_QUERY = gql`
   query findBoards($id: ID!) {
      findUserByID(id: $id) {
         boards {
            data {
               _id
               title
               description
            }
         }
      }
   }
`

export const UPDATE_DISPLAY_NAME = gql`
   mutation UpdateDisplayName($id: ID!, $uid: String!, $displayName: String) {
      updateUser(id: $id, data: { uid: $uid, displayName: $displayName }) {
         uid
         name
         displayName
      }
   }
`

export const CREATE_BOARD = gql`
   mutation CreateBoard(
      $id: ID
      $title: String
      $description: String
      $config: String
      $action: String
   ) {
      createBoard(
         data: {
            user: { connect: $id }
            title: $title
            description: $description
            config: $config
            action: $action
         }
      ) {
         _id
      }
   }
`

export const DELETE_BOARD = gql`
   mutation deleteBoard($id: ID!) {
      deleteBoard(id: $id) {
         title
      }
   }
`

export const ITEMS_QUERY = gql`
   {
      allBoards {
         data {
            _id
            title
            description
            config
            action
            user {
               _id
               name
               displayName
            }
            events {
               data {
                  _id
                  userDoing {
                     _id
                     displayName
                  }
                  userReceiving {
                     _id
                     displayName
                  }
                  count
               }
            }
         }
      }
   }
`

export const BOARD_QUERY = gql`
   query findBoard {
      findBoardByID(id: "295792854917186050") {
         _id
         title
         description
         config
         action
         user {
            _id
            displayName
         }
         events {
            data {
               userDoing {
                  _id
                  displayName
               }
               userReceiving {
                  _id
                  displayName
               }
               count
            }
         }
      }
   }
`

export const EVENTS_QUERY = gql`
   query findEvents {
      findBoardByID(id: "295792854917186050") {
         events {
            data {
               userDoing {
                  _id
                  displayName
               }
               userReceiving {
                  _id
                  displayName
               }
               count
            }
         }
      }
   }
`