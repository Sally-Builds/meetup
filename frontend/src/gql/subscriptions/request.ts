import { gql, useSubscription } from '@apollo/client';


export const FRIEND_REQUEST_SUBSCRIPTION = gql`
  subscription OnFriendRequest($user_id: ID!) {
    friendReqNotification(user_id: $user_id) {
      id
      username
      full_name
      profile_image {
        url
        publicId
      }
    }
  }
`;