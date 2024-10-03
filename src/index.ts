// import express from 'express'

import { Request, Response } from "express";



// const app = express();



// app.listen(3000, () => {
//     console.log("Server is running on port 3000")
// })

// Server setup (Express.js + Apollo Server)
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const jwt = require('jsonwebtoken');

const app = express();
const httpServer = createServer(app);

// REST API routes for authentication
app.post('/api/login', (req: Request, res: Response) => {
    // Implement login logic
    // On successful login, generate and return a JWT
});

app.post('/api/register', (req: Request, res: Response) => {
    // Implement user registration logic
});

// GraphQL schema and resolvers
const typeDefs = `
  type Query {
    messages: [Message]
  }
  
  type Mutation {
    sendMessage(content: String!): Message
  }
  
  type Subscription {
    messageAdded: Message
  }
  
  type Message {
    id: ID!
    content: String!
    user: User!
  }
  
  type User {
    id: ID!
    username: String!
  }
`;

const resolvers = {
    Query: {
        messages: (parent: any, args: any, context: any) => {
            // Fetch and return messages
        },
    },
    Mutation: {
        sendMessage: (parent: any, { content }: { content: any }, context: any) => {
            // Save message and publish to subscription
        },
    },
    Subscription: {
        messageAdded: {
            subscribe: (parent: any, args: any, context: any) => {
                // Set up subscription
            },
        },
    },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Set up Apollo Server
const server = new ApolloServer({
    schema,
    context: ({ req }: { req: Request }) => {
        // Verify JWT and add user info to context
        const token = req.headers.authorization || '';
        try {
            const user = jwt.verify(token, 'YOUR_SECRET_KEY');
            return { user };
        } catch (err) {
            return {};
        }
    },
});

server.start().then(() => {
    server.applyMiddleware({ app });

    SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: server.graphqlPath }
    );

    httpServer.listen(4000, () => {
        console.log(`Server running on http://localhost:4000${server.graphqlPath}`);
    });
});