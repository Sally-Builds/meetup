import express, { Request } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import DB from "./utils/DB";
import { config } from "./utils/config";

/**routes */
import authRouter from './routes/auth.r'

async function startServer() {
    const app = express();

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


    app.use('/api/auth', authRouter)


    const httpServer = createServer(app);
    const pubsub = new PubSub();

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

    const MESSAGE_ADDED = 'MESSAGE_ADDED';

    const resolvers = {
        Query: {
            messages: (parent: any, args: any, context: any) => {
                return "Hello World";
            },
        },
        Mutation: {
            sendMessage: (parent: any, { content }: { content: string }, context: any) => {
                pubsub.publish(MESSAGE_ADDED, { messageAdded: content });
                return `Message sent: ${content}`;
            },
        },
        Subscription: {
            messageAdded: {
                subscribe: () => pubsub.asyncIterator([MESSAGE_ADDED]),
            },
        },
    };

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    // const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //     const token = req.headers.authorization?.split(' ')[1];
    //     if (token) {
    //         try {
    //             const user = jwt.verify(token, 'your-secret-key');
    //             (req as any).user = user;
    //         } catch (error) {
    //             console.error('Invalid token:', error);
    //         }
    //     }
    //     next();
    // };

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer(
        {
            schema,
            context: (ctx) => {
                const token = ctx.connectionParams?.authentication as string;
                // if (token) {
                //     try {
                //         // const user = jwt.verify(token, 'your-secret-key');
                //         // return { user, pubsub };
                //         return {pubsub}
                //     } catch (error) {
                //         throw new Error('Invalid token');
                //     }
                // }
                // throw new Error('Missing auth token');
            },
        },
        wsServer
    );

    await server.start();

    app.use('/graphql', /**authenticate,*/ expressMiddleware(server, {
        context: async ({ req: Request }) => ({ pubsub }),
    }));

    const PORT = 4000;
    const db = new DB(console);
    db.connect(config.mongodbUri);
    httpServer.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/graphql`);
    });
}

startServer().catch((error) => {
    console.error('Error starting server:', error);
});
