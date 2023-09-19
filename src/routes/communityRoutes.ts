import express from 'express';
let router = express.Router();
import { Request, Response, NextFunction } from 'express';
import createCommunity from "../createCommunity"
import getCommunity from '../getCommunity'
import getCommunityMembers from '../getCommunityMembers'
import getOwnerCommunity from '../getOwnerCommunity'
import getMyJoinedCommunity from '../getMyJoinedCommunity'
import cookieAuth from '../middleware/cookieJwtAuth';
import { validateCreateCommunity } from '../middleware/validator';

interface CustomRequest extends Request {
    user?: any; // change this to only include id, name, email
}

//COMMUNITY
//create com
router.post('/',cookieAuth,async (req:CustomRequest, res) => {
    try {
        const ownerId = req.user.id;
        // console.log("Current user id who wants to create a community:", ownerId);

        //validation
        const {error, value} = validateCreateCommunity(req.body);

        if(error){
          res.json({
            status:false,
            error: error.details[0].message
          })
        }
        const { name } = req.body;
        
        const response = await createCommunity(ownerId, name);
        // console.log("response in post comm:", response);
        if(!response){
            res.status(500).json({ status: false, message: 'Cannot create community' });
        }
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: false, message: 'Internal server error at creating community' });
    }
    
})

//get all com
router.get('/', async( req, res) =>{
    try {
        let page:number = 1;
        let pageSize:number = 10;
        // const { page, pageSize} = req.query;
        const response = await getCommunity(page, pageSize);
        res.json(response);
    } catch (error) {
        console.error("error getting all communities",error);
        res.status(500).json({ status: false, error: 'Internal Server Error on Get Communities' });
        }
})

//get owned com
router.get('/me/owner',cookieAuth ,async(req:CustomRequest, res) => {
  try {
    const pageSize = 10; 
    const page = 1; 
    const userId = await req.user.id;
    const response = await getOwnerCommunity(pageSize, page, userId);

    res.json(response);
  } catch (error) {
    console.error("error getting owned communities",error);
    res.status(500).json({ status: false, error: 'Internal Server Error on Get  Owned Communities' });
  }
})

//get members of current com
router.get('/:id/members', async(req, res) =>{
  try {
    const communityId = req.params.id;
    const pageSize = 10;
    const page = 1;
    // const page = parseInt(req.query.page || 1, 10);
    console.log("Community Id:",communityId);
    const  response = await getCommunityMembers(communityId, page, pageSize);
    res.json(response);
  } catch (error) {
    console.log("Error in getting all members of the particular community", error);
    res.status(500).json({ status: false, error: 'Internal Server Error on Getting All Members of Community' })
  }
  
})

//get the communities current user is in as mem?
router.get('/me/member', cookieAuth, async(req:CustomRequest, res) =>{
  try {
    const pageSize = 10; 
    const page = 1; 

    const userId = await req.user.id;
    const response = await getMyJoinedCommunity(pageSize, page, userId);

    res.json(response);
  } catch (error) {
    console.log("Error in getting all communites of the signed in user", error);
    res.status(500).json({ status: false, error: 'Internal Server Error on Getting All Your Communites' })
  }

    
})
  export default router;