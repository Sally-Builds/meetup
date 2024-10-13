import { Request, Response } from "express";
import { createEvent, getEvent, getEvents } from "../services/event.s";
import { CustomError } from "../utils/customError";
import { StatusCodes } from "http-status-codes";


export const CreateEventController = async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;

    if (!file) {
        throw new CustomError({ message: `cover image is Required o`, code: StatusCodes.BAD_REQUEST });
    }

    if (file.fieldname != 'cover_image') {
        throw new CustomError({ message: `cover image is Required e`, code: StatusCodes.BAD_REQUEST });
    }

    const cover_image = { buffer: file.buffer, mimetype: file.mimetype }

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