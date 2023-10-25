import Database from "src/loaders/v1/database";
import { Snowflake } from "@theinternetfolks/snowflake";
import Logger from "src/loaders/v1/logger";
class MemberService{
    static async createMember(owner_id:string, communityId:string, userIdToAdd:string, roleId:string){
        try {
            //checking if owner has role admin
            const community = await Database.instance.community.findUnique({
                where: { id: communityId },
                select: { owner: true },
            });
            if(!community){
                return {
                    status:false,
                    error:"Community does not exists"
                }
            }
            console.log("requested community where member has to be added:", community);
    
            //check if userId exists
            const user = await Database.instance.user.findUnique({
                where:{
                    id:userIdToAdd
                }
            })
            if(!user){
                return {
                    status:false,
                    error:"User does not exists"
                }
            }
    
            //check if roleId exists
            const role = await Database.instance.role.findUnique({
                where:{
                    id:roleId
                }
            })
            if(!role){
                return {
                    status:false,
                    error:"Role does not exist"
                }
            }
    
            //CAN OWNER ADD OTHER ADMINS?
    
            const snowflakeId = Snowflake.generate();
            console.log("Sid for Member: ",snowflakeId);
    
            if(community.owner === owner_id){
                //check if user is already a member
    
                /*
    include:{
                        userref:{
                            select:{
                                id:true
                            }
                        }
                    }
                */
                const checkMember = await Database.instance.member.findFirst({
                    where:{
                        user:userIdToAdd,
                        community:communityId
                    },
                    
                })
    
                if(checkMember){
                    return {status: false, error:"User already exists as member of community"}
                }
                const newMember = await Database.instance.member.create({
                    data: {
                    id: snowflakeId,
                    communityref: {
                        connect: {
                            id: communityId 
                            } 
                        },
                    userref: {
                        connect: {
                            id: userIdToAdd
                            } 
                        },
                    roleref: {
                        connect: {
                            id: roleId 
                            } 
                        },
                    },
                });
    
                const response = {
                    status: true,
                    content: {
                      data: {
                        id: newMember.id,
                        community: communityId,
                        user: userIdToAdd,
                        role: roleId,
                        created_at: newMember.created_at,
                      },
                    },
                };
    
                return response;
            } else{
                // unauth user
                return {
                    status: false,
                    error: 'NOT_ALLOWED_ACCESS' 
                }
            }
        } catch (error) {
            console.log("Error in adding member:", error);
        }
    }

    static async deleteMember(ownerId:string, memberId:string){
        try {
            //get the community id from member id
            const member = await Database.instance.member.findUnique({
                where: {
                  id: memberId,
                },
                select: {
                  community: true,
                },
            });
              
            if (!member) {
                Logger.instance.error('Member not found.');
                throw new Error("Member not found")
            }
            //checking if owner has role admin  in the communityId
    
            Logger.instance.info("memeber exists");
            const communityId = member.community;
            Logger.instance.info("Community from where to delete",communityId);
            let isAuth = false;
    
            //1 alternate
            const owner = await Database.instance.community.findUnique({
                where:{
                    id:communityId,
                    owner: ownerId
                }
            })
    
            if(!owner){
                Logger.instance.info("Not authorised for signed in user")
                throw new Error("Not authorised for signed in user")
            }
    
            //2 
            // const user = await Database.instance.user.findUnique({
            //     where: {
            //       id: ownerId,
            //     },
            //     include: {
            //       members: {
            //         where: {
            //           community: communityId,
            //         },
            //         select: {
            //           roleref: {
            //             select: {
            //               name: true,
            //             },
            //           },
            //         },
            //       },
            //     },
            //   });
              
            //   console.log('User:', user);
              
            //   // Check if the user has members
            //   if (!user || !user.members) {
            //     console.log('User or members not found');
            //     return { status: false, error: 'User or members not found' };
            //   }
              
            //   console.log('Role for user named:', user.name, '\nRole refs:');
              
            //   // Iterate through members
            //   user.members.forEach((member) => {
            //     console.log('Member:', member);
            //     if (member.roleref.name === 'Community Admin' || member.roleref.name === 'Community Moderator') {
            //       isAuth = true;
            //     }
            //   });
              
            //   if (!isAuth) {
            //     console.log('Not authorized for signed-in user');
            //     return { status: false, error: 'NOT_ALLOWED_ACCESS' };
            //   }
              
    
            
    
            const response = await Database.instance.member.delete({
                where: {
                  id:memberId,
                  community:communityId
                },
            });
    
            // console.log("response", response)
    
            return response;
    
            
        } catch (error) {
            Logger.instance.error("Error in removing member:", error);
            throw new Error('Error in deleting member')
        }
    }
}

export default MemberService