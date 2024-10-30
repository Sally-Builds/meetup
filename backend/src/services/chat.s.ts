import Chat, { IMessage } from "../models/Chat"
import { Types } from "mongoose"
import { CustomError } from "../utils/customError"
import { pubsub } from "..";


export const sendChat = async (content: string, to: string, from: string) => {
    let chat = await Chat.findOne({ participants: { $all: [to, from] } })
        .populate({ path: "participants", select: "profile_image username full_name" });

    const message: IMessage = {
        senderId: new Types.ObjectId(from),
        content,
        timestamp: new Date(),
        status: "unread"
    };

    if (!chat) {
        // Create the chat and populate it afterwards
        chat = await Chat.create({ participants: [to, from], messages: [message] });
        chat = await Chat.findById(chat._id)
            .populate({ path: "participants", select: "profile_image username full_name" });
    } else {
        chat.messages.push(message);
        await chat.save();
    }

    // Emit chat here if needed
    await pubsub.publish(`MESSAGE_SENT_${to}`, {
        messageSentNotification: { id: from }
    })


    return chat;
};


export const getChat = async (participant: string, me: string) => {
    let chat = await Chat.findOne({ participants: { $all: [participant, me] } }).populate({ path: "participants", select: "profile_image username full_name" })

    // if (!chat) throw new CustomError({ message: "not found", code: 404 })
    let count = 0
    if (chat) {
        chat.messages.forEach((message: IMessage) => {
            if (message.status === 'unread' && message.senderId.toString() != me) {
                message.status = 'read'; // Directly set the status to 'read'
                count++
            }
        });
        await chat.save();
    }

    console.log("Now to return the number of uread messages going into the chat is or was,", count)
    return chat

}


export const getChatWithUnreadCount = async (userId: string) => {
    const chats = await Chat.aggregate([
        // Match chats where the user is a participant
        {
            $match: {
                participants: userId
            }
        },

        // Add unread message count
        {
            $addFields: {
                unreadMessageCount: {
                    $size: {
                        $filter: {
                            input: "$messages",
                            cond: {
                                $and: [
                                    { $eq: ["$$this.status", "unread"] },
                                    { $ne: ["$$this.senderId", userId] }  // Only count messages not sent by the user
                                ]
                            }
                        }
                    }
                }
            }
        },

        // Optional: Populate participant information
        {
            $lookup: {
                from: "users",
                localField: "participants",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            profile_image: 1
                        }
                    }
                ],
                as: "participants"
            }
        },

        // Optional: Sort by latest message
        {
            $sort: {
                "updatedAt": -1
            }
        }
    ]);

    return chats;
};


export const countUnreadMessages = async (userId: string): Promise<number> => {
    const result = await Chat.aggregate([
        {
            // Match chats where the user is a participant
            $match: { participants: new Types.ObjectId(userId) }
        },
        {
            // Unwind messages to access each message individually
            $unwind: "$messages"
        },
        {
            // Match messages where the message is unread, the user is not the sender, and the status is "unread"
            $match: {
                "messages.senderId": { $ne: new Types.ObjectId(userId) },
                "messages.status": "unread"
            }
        },
        {
            // Count the total number of unread messages
            $count: "unreadMessagesCount"
        }
    ]);

    // Return the count or zero if no unread messages
    return result[0]?.unreadMessagesCount || 0;
};