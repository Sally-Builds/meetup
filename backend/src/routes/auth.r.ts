import { Router } from "express";
import { LoginController, RefreshTokenController, RegisterController } from "../controllers/auth.c";
import { validationMiddleware } from "../middleware/validation.m";
import { LoginValidation, RegisterValidation } from "../validations/authSchema.v";


const router = Router();

router.post('/register', validationMiddleware(RegisterValidation), RegisterController)
router.post('/login', validationMiddleware(LoginValidation), LoginController)
router.get('/refresh', RefreshTokenController)


export default router;