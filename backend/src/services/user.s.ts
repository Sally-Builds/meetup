import User, { IUser } from "../models/User";
import { uploadImage, deleteImage } from "../utils/cloudinary";
import { CustomError } from "../utils/customError";
import { IFileBuffer } from "../utils/interfaces";


export const updateProfile = async (userId: string, payload: Partial<IUser>) => {
    const user = await User.findByIdAndUpdate({ _id: userId }, payload, { new: true });

    if (!user) throw new CustomError({ message: "user not found", code: 404 })

    return user;
}

export const uploadProfileImage = async (userId: string, file: IFileBuffer) => {
    const user = await User.findById(userId).select('-password')
    if (!user) throw new CustomError({ message: "User not found", code: 404 });

    const ProfileImageResult = await uploadImage(file.buffer)
    const profileImage = { url: (ProfileImageResult as any).secure_url, publicId: (ProfileImageResult as any).public_id }

    user.profile_image = profileImage;
    user.save();

    return user

}
export const uploadImages = async (userId: string, files: IFileBuffer[]) => {
    const user = await User.findById(userId).select('-password')
    if (!user) throw new CustomError({ message: "User not found", code: 404 });

    const uploadResults = await Promise.all(
        files.map(image => uploadImage(image.buffer))
    );
    const images = uploadResults.map((data: any) => ({ url: data.secure_url, publicId: data.public_id }))

    user.images.push(...images);
    await user.save();

    return user;
}

export const deleteImageService = async (publicId: string) => {
    const data = await deleteImage(publicId)

    return data
}