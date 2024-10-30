import { pubsub } from ".."
import { FRIEND_REQUEST_NOTIFICATION } from "../graphql/resolvers/request.resolver"
import Request from "../models/Request"
import { IUser } from "../models/User"
import { CustomError } from "../utils/customError"



export const sendRequest = async (sender: IUser, receiver: string) => {
    if (sender._id == receiver) throw new CustomError({ message: "you cannot send friend request to yourself", code: 400 })
    const alreadyExist = await Request.findOne({
        $or: [{ sender: sender._id, receiver }, { sender: receiver, receiver: sender._id }]
    })

    if (alreadyExist) throw new CustomError({ message: "Request already exists between users", code: 404 })
    const request = await Request.create({ sender, receiver })

    //send notification to receiver
    await pubsub.publish(`FRIEND_REQUEST_NOTIFICATION_${receiver}`, {
        friendReqNotification: {
            id: sender._id,
            username: sender.username,
            profile_image: sender.profile_image,
            full_name: sender.full_name
        }
    })

    return request;
}

export const updateRequest = async (receiver: string, requestId: string, status: "accepted" | "rejected") => {

    const request = await Request.findOne({ receiver, _id: requestId, status: "pending" })
        .populate({ path: 'sender', model: "User", select: 'full_name  username profile_image' });

    if (!request) throw new CustomError({ message: "Request not found", code: 404 })

    request.status = status

    await request.save();

    //send notification to sender

    return request;
}

export const getMyRequests = async (user: string, status: "pending" | "accepted" | "rejected") => {
    const payload: any = {
        receiver: user
    }
    if (status) payload.status = status
    const requests = await Request.find(payload)
        .populate({ path: 'sender', model: "User", select: 'full_name  username profile_image' });


    return { requests, length: await Request.countDocuments(payload) }
}

export const getPendingRequestCount = async (user: string) => {
    return await Request.countDocuments({ receiver: user, status: 'pending' })
}