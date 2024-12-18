import express, { Request } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createServer } from 'http';
import 'express-async-errors';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import DB from "./utils/DB";
import { config } from "./utils/config";
import { typeDefs, resolvers } from './graphql'
import { formatError } from './utils/graphqlError';

/**routes */
import authRouter from './routes/auth.r'
import userRouter from './routes/user.r'
import eventRouter from './routes/event.r'
import requestRouter from './routes/request.r'
import chatRouter from './routes/chat.r'


/**middlewares */
import { errorHandler } from './middleware/error.m';

import { PubSub } from "graphql-subscriptions";
export const pubsub = new PubSub();

async function startServer() {
    const app = express();
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


    app.use('/api/auth', authRouter)
    app.use('/api/users', userRouter)
    app.use('/api/events', eventRouter)
    app.use('/api/requests', requestRouter)
    app.use('/api/chat', chatRouter)


    app.use(errorHandler)

    const schema = makeExecutableSchema({ typeDefs, resolvers });
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
        formatError
    });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer(
        {
            schema,
            context: (ctx) => {
                // console.log(ctx.connectionParams, 'context')
                // const token = ctx.connectionParams?.authorization as string;
                // console.log(token)
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

    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => {
            // console.log('from here', req.headers.authorization)
            return {
                token: req.headers.authorization,
                cookies: req.cookies
            }
        }
    }));

    const PORT = config.port;
    const db = new DB(console);
    db.connect(config.mongodbUri);
    httpServer.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/graphql`);
    });
}

startServer().catch((error) => {
    console.error('Error starting server:', error);
});
