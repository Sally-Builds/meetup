import { Router } from "express";
import { authenticate } from "../middleware/authenticate.m";
import { CountUnreadMessagesController, GetChatWithFriendController, GetChatsController, SendChatController } from "../controllers/chat.c";
import { sendChatValidation } from "../validations/chatSchema.v";
import { validationMiddleware } from "../middleware/validation.m";


const router = Router({ mergeParams: true });


router.route('/').post(authenticate, validationMiddleware(sendChatValidation), SendChatController)

router.get('/unread', authenticate, CountUnreadMessagesController)

router.get('/', authenticate, GetChatWithFriendController)
router.get('/all', authenticate, GetChatsController)

export default router;