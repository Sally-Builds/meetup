// src/queries.js
import { gql } from '@apollo/client';

export const GET_CHAT = gql`
  query getChat($friendId: String!) {
    getChat(friendId: $friendId) {
      _id
      createdAt
      updatedAt
      messages {
        senderId
        timestamp
        content
        status
        _id
      }
      participants {
        _id
        username
        full_name
        profile_image {
          url
          publicId
        }
      }
    }
  }
`;