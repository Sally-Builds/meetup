import { ObjectId, Types, Schema, model } from "mongoose";


export interface IMessage {
    senderId: Types.ObjectId;
    content: string;
    timestamp: Date;
    status: "read" | "unread"
}

export interface IChat {
    _id?: Types.ObjectId;
    participants: Types.ObjectId[];
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: String,
    timestamp: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: "read",
        enum: ["read", "unread"]
    }
})

const chatSchema = new Schema<IChat>({
    participants: {
        type: [Schema.Types.ObjectId],
        ref: "User"
    },
    messages: {
        type: [messageSchema]
    }
}, {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
})


export default model('Chat', chatSchema)