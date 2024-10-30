import { NextFunction, Request, Response } from "express";
import { countUnreadMessages, getChat, getChatWithUnreadCount, sendChat } from "../services/chat.s";


export const SendChatController = async (req: Request, res: Response, next: NextFunction) => {
    const { content, to } = req.body
    console.log(req.body)
    const data = await sendChat(content, to, req.user._id)

    res.status(200).json({ data })
}

export const GetChatWithFriendController = async (req: Request, res: Response, next: NextFunction) => {
    const chat = await getChat(req.params.friendId, req.user._id)

    res.status(200).json({ data: chat })
}

export const GetChatsController = async (req: Request, res: Response, next: NextFunction) => {
    const data = await getChatWithUnreadCount(req.user._id)

    res.status(200).json({ data })
}

export const CountUnreadMessagesController = async (req: Request, res: Response, next: NextFunction) => {
    const data = await countUnreadMessages(req.user._id)

    res.status(200).json({ count: data })
}