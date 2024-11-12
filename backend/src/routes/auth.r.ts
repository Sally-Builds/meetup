import { Router } from "express";
import { LoginController, RefreshTokenController, RegisterController, isEmailController, isUsernameController, logoutController, updatePasswordController } from "../controllers/auth.c";
import { validationMiddleware } from "../middleware/validation.m";
import { LoginValidation, RegisterValidation } from "../validations/authSchema.v";
import { authenticate } from "../middleware/authenticate.m";


const router = Router();

router.post('/is-email', isEmailController)
router.post('/is-username', isUsernameController)
router.get('/refresh', RefreshTokenController)


router.post('/register', validationMiddleware(RegisterValidation), RegisterController)
router.post('/login', validationMiddleware(LoginValidation), LoginController)
router.get('/logout', authenticate, logoutController)
router.patch('/update-password', authenticate, updatePasswordController)


export default router;