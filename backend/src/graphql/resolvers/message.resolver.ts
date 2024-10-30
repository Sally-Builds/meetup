import { pubsub } from "../..";
import { graphqlAuthenticate } from "../../middleware/authenticate.m";
import { getChat, sendChat } from "../../services/chat.s";

const MESSAGE_SENT = 'MESSAGE_SENT';

export const messageResolvers = {
    Query: {
        getChat: async (parent: any, { friendId }: { friendId: string }, context: any) => {
            const user = await graphqlAuthenticate(context.token)
            const data = await getChat(friendId, user._id)
            // console.log(data, 'from resolver')
            return data;
        },
    },
    Mutation: {
        sendMessage: async (parent: any, payload: { content: string, to: string, from: string }, context: any) => {
            console.log(payload, 'my content')
            const chat = await sendChat(payload.content, payload.to, payload.from)
            return 'successful';
        },
    },
    Subscription: {
        messageSentNotification: {
            subscribe: (_: any, { receiver_id }: { receiver_id: string }, context: any) => {
                console.log(receiver_id, `MESSAGE_SENT_${receiver_id}`)
                return pubsub.asyncIterator(`MESSAGE_SENT_${receiver_id}`);
            }
        },
    },
};