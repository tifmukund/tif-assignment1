import express from "express"
import { validateCreateRole } from '../../middleware/validator';
import RoleService from "../../services/RoleService";

class RoleController{
    static async createRole(req:express.Request, res:express.Response){
        try {
            //validation
            const {error, value} =  validateCreateRole(req.body);
            if(error){
              return res.json({
                status: false,
                error: error.details[0].message
              })
            }
            const {name} = req.body;
            if(name !== "Community Admin" && name !== "Community Member" && name !== "Community Moderator"){
              return res.json({
                status:false,
                message:"Please select name: Community Admin or Community Member"
                })
              }
            //add validation, min len 2
            const response = await RoleService.createRole(name);
            
            return res.json(response);
            } catch (error) {
              console.error("error creating roles",error);
              res.status(500).json({ status: false, error: 'Internal Server Error on Create Role' });
            }
    }

    static async getAllRoles(req:express.Request, res:express.Response){
        try{
            let page:number = 1;
            let pageSize:number = 10;
            // const { page, pageSize} = req.query;
            const offset:number = (page - 1) * pageSize;
        
            const response = await RoleService.getAllRols(page, pageSize, offset);
        
            res.json(response);
          } catch (error) {
            res.status(500).json({ status: false, error: 'Internal Server Error on Get All Roles' });
          }
    }
}

export default RoleController;