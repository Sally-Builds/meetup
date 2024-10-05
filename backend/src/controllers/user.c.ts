import { Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { StatusCodes } from "http-status-codes";


export const GetMeController = async (req: Request, res: Response) => {
    const user = req.user;
    res.status(200).json({ data: user })
}

export const UploadProfileImageController = async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files) {
        throw new CustomError({ message: `imageg and cover image is Required`, code: StatusCodes.BAD_REQUEST });
    }

    if (!files['cover_image']) {
        throw new CustomError({ message: `cover image is Required`, code: StatusCodes.BAD_REQUEST });
    }

    const cover_image = { buffer: files['cover_image'][0].buffer, mimetype: files['cover_image'][0].mimetype }
    res.status(200).json({ data: "okay" })
}

export const UploadImagesController = async (req: Request, res: Response) => {
    res.status(200).json({ data: "okay" })
}

export const DeleteImageController = async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files) {
        throw new CustomError({ message: `At least 3 images are Required`, code: StatusCodes.BAD_REQUEST });
    }

    if (!files['images']) {
        throw new CustomError({ message: `images is Required`, code: StatusCodes.BAD_REQUEST });
    }

    const images = files['images'].map(image => {
        return { buffer: image.buffer, mimetype: image.mimetype }
    })

    res.status(200).json({ data: "okay" })
} 