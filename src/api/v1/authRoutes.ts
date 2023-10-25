import express from 'express';
import cookieAuth from '../../middleware/cookieJwtAuth';
import AuthController from '../../controllers/v1/AuthController';

let router = express.Router();

router.post('/signup', AuthController.signup)
router.post('/signin', AuthController.signin)
router.get('/me',cookieAuth, AuthController.myProfile)
  
export default router;