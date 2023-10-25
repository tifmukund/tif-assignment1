import { Snowflake } from "@theinternetfolks/snowflake";
import Logger from '../loaders/v1/logger';
import Database from '../loaders/v1/database';

function formatCommunity(community) {
    return {
      id: community.id,
      name: community.name,
      slug: community.slug,
      owner: {
        id: community.owner,
        name: community.useref.name,
      },
      created_at: community.created_at.toISOString(),
      updated_at: community.updated_at.toISOString(),
    };
  }

class CommunityService{
    
    static async createCommunity(ownerId:string, name:string){
        try {
            // creating  slug from COMMUNITY name
        const created_slug = `${name}-${Math.random().toString(36).substring(2, 10)}`;

        const snowflakeId = Snowflake.generate();
        console.log("Sid for community: ",snowflakeId);


        const community = await Database.instance.community.create({
            data:{
                id: snowflakeId,
                name: name,
                slug: created_slug,
                useref:{
                    connect:{
                        id: ownerId
                    }
                }
            }
        })
        // console.log("Community:", community)
        const response = {
            status: true,
            content: {
            data: community
            }
        }
        // console.log("response in createCOm:", response)

        return response;
        } catch (error) {
            Logger.instance.error("Error in create Community: ", error)
            throw new Error('Error in create Community')
        }
    }

    static async getAllCommunity(page:number, pageSize:number){
        try {
    
            const offset:number = (page - 1) * pageSize;
        
            const totalCount = await Database.instance.community.count();
        
            const totalPages = Math.ceil(totalCount / pageSize);
        
            //all com, & owner slected info
        
            //I MADE A typo, useref instead of userref
            const communities  = await Database.instance.community.findMany({
              skip: offset,
              take: pageSize,
              include: {
                useref: { 
                  select: {
                    id:true,
                    name: true, 
                  },
                },
              },
            })
        
            // const owner = await.prsima.
            
            // console.log("Communites all:", communities)
        
            //to remove useref & add it to owner instead
            const formattedCommunities = communities.map(formatCommunity);
        
            const response = {
                status: true,
                content: {
                  meta: {
                    total: totalCount,
                    pages: totalPages,
                    page: page,
                  },
                  data: formattedCommunities,
                },
            }
        
            // console.log("response:", response)
            return response;
            
            }catch(error){
                Logger.instance.error("error in getting community:", error)
                throw new Error('Error in getAllCommunities.')
            }
    }

    static async getOwnerCommunity(pageSize:number, page:number, userId:string){
        try {
            const offset = (page - 1) * pageSize;
    
            // Getting all owner Communiteis
            const owned = await Database.instance.community.findMany({
            where: {
                owner: userId, // Filter by the user's ID
            },
            skip: offset,
            take: pageSize,
            });
    
            if(!owned){
                return {status: false, error:"User is not owner of any communities."}
            }
            //count communities he owns
            const totalowned = await Database.instance.community.count({
            where:{
                owner: userId,
            },
            });
    
            // total pages
            const totalPages = Math.ceil(totalowned / pageSize);
    
            const response ={
            status: true,
            content: {
                meta: {
                total: totalowned,
                pages: totalPages,
                page,
                },
                data: owned.map((community) => ({
                id: community.id,
                name: community.name,
                slug: community.slug,
                owner: community.owner,
                created_at: community.created_at.toISOString(),
                updated_at: community.updated_at.toISOString(),
                }))
            },
            };
            return response;
    
        } catch (error) {
            Logger.instance.error("Error in getting current user created communities:", error);
            return {status: false, error:"Error getting Owned Community"}
        }
    }

    static async getMyCommunities(pageSize:number, page:number, userId:string){
        try {
            // skip
            const offset = (page - 1) * pageSize;
    
            //  total count of joined communities
            const totalJoinedCommunities = await Database.instance.member.count({
                where: {
                    user: userId,
                },
                });
            
            const totalPages = Math.ceil(totalJoinedCommunities / pageSize);
    
            // get all rows where user is member, then using community ref, get details of that com, further using userref inside it get the owner id & name
            const joinedCommunities = await Database.instance.member.findMany({
            where: {
                user: userId, // Filter by the user's ID
            },
            select: {
                communityref: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    useref: { //is pointing to owner
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    created_at: true,
                    updated_at: true,
                },
                },
            },
            skip: offset,
            take: pageSize,
            });
    
            
    
            // Construct the response JSON
            const response = {
            status: true,
            content: {
                meta: {
                total: totalJoinedCommunities,
                pages: totalPages,
                page,
                },
                data: joinedCommunities.map((member) => ({
                id: member.communityref.id,
                name: member.communityref.name,
                slug: member.communityref.slug,
                owner: member.communityref.useref,
                created_at: member.communityref.created_at,
                updated_at: member.communityref.updated_at,
                })),
            },
            };
    
            return response;
        } catch (error) {
            Logger.instance.error("Error in removing member:", error);
            throw new Error('Error in getMyCommunities')
        }
    }

    static async getAllMembersOfCommunity(communityId:string, page:number, pageSize:number){
        try {
            const skip = (page - 1) * pageSize;
            // total number of memebers in a particular community
            const totalCount = await Database.instance.member.count({
                where: { community: communityId },
            });
          
            // Calculate pagination metadata
            const totalPages = Math.ceil(totalCount / pageSize);
    
            const members = await Database.instance.member.findMany({
              where: { community: communityId },
              skip,
              take: pageSize,
              
              include:{
                userref:{
                    select:{
                        id: true,
                        name: true
                    }
                },
                roleref:{
                    select:{
                        id:true,
                        name:true,
                    }
                }
              }
            });
            const formatMembers =  members.map((member) =>{
                return {
                    id:member.id,
                    community: member.community,
                    user:{
                        id: member.userref.id,
                        name: member.userref.name
                    },
                    role:{
                        id:member.roleref.id,
                        name:member.roleref.name
                    },
                    created_at:member.created_at
                }
            })
    
        
            const response = {
              status: true,
              content: {
                meta: {
                  total: totalCount,
                  pages: totalPages,
                  page,
                },
                data: formatMembers,
              },
            };
        
            // Send the response
            return response;
          } catch (error) {
            // Handle errors and send an appropriate response
            Logger.instance.error('Error fetching community members:', error);
            throw new Error('Error in getAllMembers')
          }
    }

}

export default CommunityService;