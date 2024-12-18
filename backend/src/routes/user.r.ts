import { Router } from "express";
import { DeleteImageController, GetAllUsersController, GetMeController, UploadImagesController, UploadProfileImageController, getUsersWithSimilarInterestController, updateProfileController } from "../controllers/user.c";
import multer from "multer";
import path from "path";
import { CustomError } from "../utils/customError";
import { authenticate } from "../middleware/authenticate.m";
import { validationMiddleware } from "../middleware/validation.m";
import { UpdateUserValidation } from "../validations/userSchema.v";
import requestRouter from './request.r'
import chatRouter from './chat.r'


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
const coverUpload = upload.fields([{ name: 'profile_image', maxCount: 1 }])
const imagesUpload = upload.fields([{ name: 'images', maxCount: 5 }])


router.use('/:userId/requests', requestRouter)
router.use('/:friendId/chat', chatRouter)

router.get('/me', authenticate, GetMeController)

router.post('/upload-profile-image', authenticate, coverUpload, UploadProfileImageController)
router.post('/upload-images', authenticate, imagesUpload, UploadImagesController)
router.get('/similar-interests', authenticate, getUsersWithSimilarInterestController)
//delete image route
router.post('/delete-image', authenticate, DeleteImageController)
router.patch('/', authenticate, validationMiddleware(UpdateUserValidation), updateProfileController)

router.route('/').get(authenticate, GetAllUsersController)


export default router;