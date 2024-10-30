import { pubsub } from "../..";

export const FRIEND_REQUEST_NOTIFICATION = 'FRIEND_REQUEST_NOTIFICATION';

export const requestResolvers = {
    Subscription: {
        friendReqNotification: {
            subscribe: (_: any, { user_id }: { user_id: string }, context: any) => {
                console.log(user_id, `FRIEND_REQUEST_NOTIFICATION_${user_id}`)
                return pubsub.asyncIterator(`FRIEND_REQUEST_NOTIFICATION_${user_id}`);
            }
        },
    },
};