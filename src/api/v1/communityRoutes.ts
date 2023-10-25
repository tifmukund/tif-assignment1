import express from 'express';
let router = express.Router();
import CommunityController from '@controllers/v1/CommunityController';
import cookieAuth from '../../middleware/cookieJwtAuth';


//COMMUNITY
router.post('/',cookieAuth, CommunityController.createCommunity)
router.get('/', CommunityController.getAll)
router.get('/me/owner',cookieAuth ,CommunityController.getOwnerCommunity)
router.get('/me/member', cookieAuth, CommunityController.getAllMembersOfCommunity)
router.get('/:id/members', CommunityController.getMyCommunities)

export default router;