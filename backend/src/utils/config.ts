import dotenv from 'dotenv'

dotenv.config()

export const config = {
    port: process.env.PORT || 3000,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/meetup',
    jwtSecret: process.env.JWT_SECRET_KEY || 'fallback_secret',
    cloudinaryApiSecret: process.env.ClOUDINARY_API_SECRET || "",
    cloudinary_name: process.env.ClOUDINARY_CLOUD_NAME || "",
    cloudinaryApiKey: process.env.ClOUDINARY_API_KEY || ""
};