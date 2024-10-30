import { gql } from '@apollo/client';


export const MESSAGE_NOTIFICATION_SUBSCRIPTION = gql`
  subscription MessageSentNotification($receiver_id: String!) {
    messageSentNotification(receiver_id: $receiver_id) {  
      id
    }
  }
`;

