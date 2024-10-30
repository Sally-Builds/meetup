import { ApolloClient, InMemoryCache, split, HttpLink, from } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        return refreshToken().then(newToken => {
          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: `Bearer ${newToken}`,
            },
          });
          return forward(operation);
        });
      }
    }
  }
});

async function refreshToken() {
  try {
    const response = await axios.get(`${BASE_URL}auth/refresh`, {
      withCredentials: true,
    });

    const { token } = response.data.data;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    return null;
  }
}

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
  connectionParams: {
    // Add authentication token for WebSocket connection
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  // Add retry logic for WebSocket connection
  retryAttempts: 5,
  shouldRetry: () => true,
  // Optional: handle connection status
  on: {
    connected: () => console.log('WS Connected'),
    error: (error) => console.error('WS Error:', error),
    closed: () => console.log('WS Closed'),
  }
}));

// Combine HTTP and WebSocket links
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  from([errorLink, authLink, httpLink])  // Combine HTTP-related links
);

export const apolloClient = new ApolloClient({
  link: splitLink,  // Use the combined split link
  cache: new InMemoryCache()
});

// Optional: Handle WebSocket reconnection on token refresh
window.addEventListener('storage', (event) => {
  if (event.key === 'token') {
    // Reconnect WebSocket with new token
    wsLink.client.dispose();
  }
});