import { PrismaClient } from '@prisma/client'
import { Snowflake } from "@theinternetfolks/snowflake";

const prisma = new PrismaClient()

export default async function main(owner_id, communityId, userIdToAdd, roleId ) {
    try {
        //checking if owner has role admin
        const community = await prisma.community.findUnique({
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
        const user = await prisma.user.findUnique({
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
        const role = await prisma.role.findUnique({
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
            const checkMember = await prisma.member.findFirst({
                where:{
                    user:userIdToAdd,
                    community:communityId
                },
                
            })

            if(checkMember){
                return {status: false, error:"User already exists as member of community"}
            }
            const newMember = await prisma.member.create({
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
