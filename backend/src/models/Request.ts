import { ObjectId, Schema, model } from "mongoose";


export interface IRequest {
    _id?: ObjectId;
    sender: ObjectId;
    receiver: ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
}

const requestSchema = new Schema<IRequest>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: "pending",
        enum: ['pending', 'accepted', 'rejected']
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

export default model('Request', requestSchema)