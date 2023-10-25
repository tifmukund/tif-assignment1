import express from "express";
import { validateCreateCommunity } from '../../middleware/validator';
import CommunityService from "src/services/CommunityServices";
import Logger from "src/loaders/v1/logger";

interface CustomRequest extends express.Request {
    // Add your custom properties here
    user: {
      id: string;
      name: string;
      email: string;
      created_at: Date;
    };
  }

class CommunityController{

    static async createCommunity(req:CustomRequest, res: express.Response){
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
            
            const response = await CommunityService.createCommunity(ownerId, name);
            // console.log("response in post comm:", response);
            if(!response){
                res.status(500).json({ status: false, message: 'Cannot create community' });
            }
            res.json(response);
        } catch (error) {
            res.status(500).json({ status: false, message: 'Internal server error at creating community' });
        }

    }

    static async getAll(req:express.Request, res: express.Response){
        try {
            let page:number = 1;
            let pageSize:number = 10;
            // const { page, pageSize} = req.query;
            const response = await CommunityService.getAllCommunity(page, pageSize);
            res.json(response);
        } catch (error) {
            res.status(500).json({ status: false, error: 'Internal Server Error on Get Communities' });
            }

    }
    static async getOwnerCommunity(req:CustomRequest, res: express.Response){
        try {
            const pageSize = 10; 
            const page = 1; 
            const userId = await req.user.id;
            const response = await CommunityService.getOwnerCommunity(pageSize, page, userId);
        
            res.json(response);
          } catch (error) {
            res.status(500).json({ status: false, error: 'Internal Server Error on Get  Owned Communities' });
          }
    }
    static async getMyCommunities(req:CustomRequest, res: express.Response){
        try {
            const pageSize = 10; 
            const page = 1; 
        
            const userId = await req.user.id;
            const response = await CommunityService.getMyCommunities(pageSize, page, userId);
        
            res.json(response);
          } catch (error) {
            // console.log("Error in getting all communites of the signed in user", error);
            res.status(500).json({ status: false, error: 'Internal Server Error on Getting All Your Communites' })
          }
    }
    static async getAllMembersOfCommunity(req:express.Request, res: express.Response){
        try {
            const communityId = req.params.id;
            const pageSize = 10;
            const page = 1;
            // const page = parseInt(req.query.page || 1, 10);
            Logger.instance.info("Community Id:",communityId);
            const  response = await CommunityService.getAllMembersOfCommunity(communityId, page, pageSize);
            res.json(response);
          } catch (error) {
            res.status(500).json({ status: false, error: 'Internal Server Error on Getting All Members of Community' })
          }

    }



}

export default CommunityController;