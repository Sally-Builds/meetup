import { Request, Response } from "express";
import { getConnections, getMyRequests, getPendingRequestCount, sendRequest, updateRequest } from "../services/request.s";
import { CustomError } from "../utils/customError";



export const sendRequestController = async (req: Request, res: Response) => {
    const request = await sendRequest(req.user, req.params.userId);

    res.status(201).json({ data: request })
}

export const updateRequestController = async (req: Request, res: Response) => {
    const status = req.query.status as ("accepted" | "rejected")

    if (!status) throw new CustomError({ message: "Please provide status", code: 400 })


    const request = await updateRequest(req.user._id, req.params.id, status);

    res.status(200).json({ data: request })
}

export const getMyRequestsController = async (req: Request, res: Response) => {
    const query = req.query.status as ("pending" | "accepted" | "rejected")

    const requests = await getMyRequests(req.user._id, query)

    res.status(200).json({ data: requests })
}

export const getPendingRequestCountController = async (req: Request, res: Response) => {
    const count = await getPendingRequestCount(req.user._id)

    res.status(200).json({ data: count })
}

export const getConnectionsController = async (req: Request, res: Response) => {
    const data = await getConnections(req.user._id)

    res.status(200).json({ data })
}