import { Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { StatusCodes } from "http-status-codes";
import { updateProfile, uploadImages, uploadProfileImage } from "../services/user.s";


export const GetMeController = async (req: Request, res: Response) => {
    const user = req.user;
    res.status(200).json({ data: user })
}

export const updateProfileController = async (req: Request, res: Response) => {
    const data = await updateProfile(req.user._id, req.body);
    res.status(200).json({ data })
}

export const UploadProfileImageController = async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files) {
        throw new CustomError({ message: `profile image is Required`, code: StatusCodes.BAD_REQUEST });
    }

    if (!files['profile_image']) {
        throw new CustomError({ message: `profile image is Required`, code: StatusCodes.BAD_REQUEST });
    }

    const cover_image = { buffer: files['profile_image'][0].buffer, mimetype: files['profile_image'][0].mimetype }

    const data = await uploadProfileImage(req.user._id, cover_image)
    res.status(200).json({ data })
}

export const UploadImagesController = async (req: Request, res: Response) => {
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
    const data = await uploadImages(req.user._id, images)
    res.status(200).json({ data })
}

export const DeleteImageController = async (req: Request, res: Response) => {

    res.status(200).json({ data: "okay" })
} 