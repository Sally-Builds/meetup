import { Router } from "express";
import { DeleteImageController, GetMeController, UploadImagesController, UploadProfileImageController } from "../controllers/user.c";
import multer from "multer";
import path from "path";
import { CustomError } from "../utils/customError";
import { authenticate } from "../middleware/authenticate.m";


const router = Router();
const storage = multer.memoryStorage()


const fileFilter = (req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

    if (allowedExtensions.indexOf(ext) === -1) {
        return cb(new CustomError({ message: 'Only images are allowed!', code: 400 }));
    }

    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter })
const coverUpload = upload.fields([{ name: 'cover_image', maxCount: 1 }])
const imagesUpload = upload.fields([{ name: 'images', maxCount: 5 }])


router.post('/upload-profile-image', coverUpload, UploadProfileImageController)
router.post('/upload-images', imagesUpload, UploadImagesController)
//delete image route
router.post('/delete-image', DeleteImageController)

router.route('/').get(authenticate, GetMeController)


export default router;