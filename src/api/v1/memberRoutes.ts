import express from 'express';
let router = express.Router();
import MemberController from '../../controllers/v1/MemberController';
import cookieAuth from '../../middleware/cookieJwtAuth';

router.post('/',cookieAuth ,MemberController.createMember)
router.delete('/:id', cookieAuth,MemberController.deleteMember)

export default router;