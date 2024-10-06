import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary'
import { config } from './config';

cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
});

export default cloudinary

export const uploadImage = (buffer: Buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: 'meetup', // Specify your folder name here
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export const deleteImage = (publicId: string) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};