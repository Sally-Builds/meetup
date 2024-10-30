import { Application, Request, Response } from "express";
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
import 'express-async-errors';
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const jwt = require('jsonwebtoken');
import dotenv from 'dotenv';
import cors from "cors";
import { config } from "./utils/config";
import { errorHandler } from "./middleware/error.m";
import DB from "./utils/DB";
import cookieParser from 'cookie-parser';

/**routes */
import authRouter from './routes/auth.r'
import userRouter from './routes/user.r'
import eventRouter from './routes/event.r'
import { PubSub, PubSubEngine } from "graphql-subscriptions";

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);

const corsOptions = {
    origin: [
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'http://localhost:3000/',
        'http://192.168.43.69:3000/',
        '*'], // Replace with your frontend URL
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// app.options("*", cors());

// REST API routes for authentication
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/events', eventRouter)




// GraphQL schema and resolvers
const typeDefs = `
  type Query {
    messages: String
  }
  
  type Mutation {
    sendMessage(content: String!): String
  }
  
  type Subscription {
    messageAdded: String
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

const pubsub = new PubSub();
const MESSAGE_ADDED = 'MESSAGE_ADDED';

const resolvers = {
    Query: {
        messages: (parent: any, args: any, context: any) => {
            // Fetch and return messages
            return "Hello World"
        },
    },
    Mutation: {
        sendMessage: (parent: any, { content }: { content: string }, context: any) => {
            pubsub.publish(MESSAGE_ADDED, {
                messageAdded: content  // Publishing the content directly as a string
            });

            return `Message sent: ${content}`;
        },
    },
    Subscription: {
        messageAdded: {
            subscribe: () => pubsub.asyncIterator(['MESSAGE_ADDED'])


        },
    },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Set up Apollo Server
const server = new ApolloServer({
    schema,
    // context: ({ req }: { req: Request }) => {
    //     // Verify JWT and add user info to context
    //     const token = req.headers.authorization || '';
    //     try {
    //         const user = jwt.verify(token, 'YOUR_SECRET_KEY');
    //         return { user };
    //     } catch (err) {
    //         return {};
    //     }
    // },
});
app.use(errorHandler)

server.start().then(() => {
    server.applyMiddleware({ app });

    SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: server.graphqlPath }
    );

    const db = new DB(console);
    db.connect(config.mongodbUri);
    httpServer.listen(config.port, () => {
        console.log(`Server running on http://localhost:${config.port}${server.graphqlPath}`);
    });
});