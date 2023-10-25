import Database from "src/loaders/v1/database";
import { Snowflake } from "@theinternetfolks/snowflake";
import Logger from "src/loaders/v1/logger";
class RoleService{
    static async createRole(name) {
        try {
            const snowflakeId = Snowflake.generate();
            console.log("Sid for Role: ",snowflakeId);
            const role = await Database.instance.role.create({
              data: {
                id: snowflakeId,
                name: `${name}`
              }
            })
            const response = {
              status:true,
              content:{
                data:role
              }
            }
            return response;
        } catch (error) {
            Logger.instance.error("Error in createRole", error)
            throw new Error('Error in createRole')
        }
        
    }

    static async getAllRols(page:number, pageSize:number, offset:number){
        try {
      
            const roles = await Database.instance.role.findMany({
                skip: offset,
                take: pageSize,
              });
            
            const totalCount = await Database.instance.role.count();
            
            const totalPages = Math.ceil(totalCount / pageSize);
            
            const response = {
                status: true,
                content: {
                  meta: {
                    total: totalCount,
                    pages: totalPages,
                    page: page,
                  },
                  data: roles,
                },
              };
            return response;
          
          }catch(error){
              Logger.instance.error("error in getting roles:", error)
              throw new Error('Error in getAllRoles')
          }
    }
}

export default RoleService;