import mongoose, { Types } from "mongoose";
import User, { IUser } from "../models/User";
import { uploadImage, deleteImage } from "../utils/cloudinary";
import { CustomError } from "../utils/customError";
import { IFileBuffer } from "../utils/interfaces";
import Request from "../models/Request";


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

export const getUsers = async (myId: string) => {
    try {
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: new Types.ObjectId(myId) }
                }
            },
            {
                $lookup: {
                    from: 'requests',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        // Check if current user is involved with this user in any request
                                        {
                                            $and: [
                                                { $eq: ['$sender', new Types.ObjectId(myId)] },
                                                { $eq: ['$receiver', '$$userId'] }
                                            ]
                                        },
                                        {
                                            $and: [
                                                { $eq: ['$receiver', new Types.ObjectId(myId)] },
                                                { $eq: ['$sender', '$$userId'] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'requests'
                }
            },
            {
                $match: {
                    requests: { $size: 0 }
                }
            },
            {
                $project: {
                    _id: 1,
                    full_name: 1,
                    username: 1,
                    dob: 1,
                    email: 1,
                    occupation: 1,
                    gender: 1,
                    phone: 1,
                    interests: 1,
                    location: 1,
                    profile_image: 1,
                    images: 1
                }
            }
        ]);

        return users;
    } catch (error) {
        throw error;
    }
};


interface MatchedUser extends IUser {
    sharedInterests: string[];
    similarityScore: number;
}

export const findUsersWithSimilarInterests = async (
    userId: string,
    page: number = 1,
    limit: number = 1000
): Promise<MatchedUser[]> => {
    const skip = (page - 1) * limit;

    // Get the current user's interests
    const currentUser = await User.findById(userId);
    if (!currentUser) {
        throw new Error('User not found');
    }

    // Get IDs of users who are friends or have pending requests
    const requests = await Request.find({
        $or: [
            { sender: userId },
            { receiver: userId }
        ],
        status: { $in: ['accepted', 'pending'] }
    });

    // Extract all user IDs from requests (both sender and receiver)
    const excludeUserIds = requests.reduce((acc: mongoose.Types.ObjectId[], request) => {
        const senderId = request.sender as unknown as mongoose.Types.ObjectId;
        const receiverId = request.receiver as unknown as mongoose.Types.ObjectId;

        if (senderId.toString() !== userId) {
            acc.push(senderId);
        }
        if (receiverId.toString() !== userId) {
            acc.push(receiverId);
        }
        return acc;
    }, []);


    const users = await User.aggregate([
        // Exclude the current user and friends/pending requests
        {
            $match: {
                $and: [
                    { _id: { $ne: new mongoose.Types.ObjectId(userId) } },
                    { _id: { $nin: excludeUserIds } }
                ]
            }
        },
        // Calculate shared interests
        {
            $addFields: {
                sharedInterests: {
                    $setIntersection: ['$interests', currentUser.interests]
                }
            }
        },
        // Calculate similarity score
        {
            $addFields: {
                similarityScore: { $size: '$sharedInterests' }
            }
        },
        // Only include users with at least one shared interest
        {
            $match: {
                similarityScore: { $gt: 0 }
            }
        },
        // Sort by similarity score (highest first)
        {
            $sort: {
                similarityScore: 1
            }
        },
        // Pagination
        { $skip: skip },
        { $limit: limit },
        // Exclude sensitive fields
        {
            $project: {
                password: 0,
            }
        }
    ]);

    return users;
};