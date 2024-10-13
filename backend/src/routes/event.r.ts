import { Router } from "express";
import multer from "multer";
import path from "path";
import { CustomError } from "../utils/customError";
import { authenticate } from "../middleware/authenticate.m";
import { CreateEventController, GetAllEventsController, GetEventController } from "../controllers/event.c";
import { validationMiddleware } from "../middleware/validation.m";
import { CreateEventValidation } from "../validations/eventSchema.v";


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
const coverUpload = upload.single('cover_image')

router.route('/').post(authenticate, coverUpload, validationMiddleware(CreateEventValidation), CreateEventController).get(authenticate, GetAllEventsController)
router.route('/:slug').get(authenticate, GetEventController)


export default router;
