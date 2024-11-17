import { readFileSync } from 'fs';
import path from 'path';
import { messageResolvers } from './resolvers/message.resolver';
import { requestResolvers } from './resolvers/request.resolver';
import { GraphQLDateTime } from 'graphql-scalars';



const messageTypes = readFileSync(path.join(__dirname, "./typeDefs/message.graphql"), { encoding: 'utf-8' })
const requestTypes = readFileSync(path.join(__dirname, "./typeDefs/request.gql"), { encoding: "utf-8" })


export const typeDefs = `
    scalar DateTime
    ${messageTypes}
    ${requestTypes}
`;


export const resolvers = {
    Query: {
        ...messageResolvers.Query,
    },
    Mutation: {
        ...messageResolvers.Mutation,
    },
    Subscription: {
        ...messageResolvers.Subscription,
        ...requestResolvers.Subscription
    },
};