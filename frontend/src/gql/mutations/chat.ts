import { gql } from '@apollo/client';

export const SEND_CHAT = gql`
  mutation SendMessage($to: String!, $from: String!, $content: String!) {
    sendMessage(to: $to, from: $from, content: $content)
  }
`;