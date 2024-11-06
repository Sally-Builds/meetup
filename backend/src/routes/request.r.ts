import { Router } from "express";
import { authenticate } from "../middleware/authenticate.m";
import { getConnectionsController, getMyRequestsController, getPendingRequestCountController, sendRequestController, updateRequestController } from "../controllers/request.c";


const router = Router({ mergeParams: true });

router.get('/count', authenticate, getPendingRequestCountController)
router.get('/connections', authenticate, getConnectionsController)

router.route('/')
    .get(authenticate, getMyRequestsController)
    .post(authenticate, sendRequestController)

router.route('/:id').patch(authenticate, updateRequestController)


export default router;