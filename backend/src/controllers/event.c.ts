import { Request, Response } from "express";
import { createEvent, getEvent, getEvents } from "../services/event.s";
import { CustomError } from "../utils/customError";
import { StatusCodes } from "http-status-codes";


export const CreateEventController = async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files) {
        throw new CustomError({ message: `cover image is Required`, code: StatusCodes.BAD_REQUEST });
    }

    if (!files['cover_image']) {
        throw new CustomError({ message: `cover image is Required`, code: StatusCodes.BAD_REQUEST });
    }

    const cover_image = { buffer: files['cover_image'][0].buffer, mimetype: files['cover_image'][0].mimetype }

    const data = await createEvent(req.user._id, req.body, cover_image)
    res.status(200).json({ data })
}

export const GetAllEventsController = async (req: Request, res: Response) => {
    const data = await getEvents(req.query)

    res.status(200).json({ data })

}

export const GetEventController = async (req: Request, res: Response) => {
    const data = await getEvent(req.params.slug)

    res.status(200).json({ data })
}