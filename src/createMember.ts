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
        console.log("requested community where member has to be added:", community);

        const snowflakeId = Snowflake.generate();
        console.log("Sid for Member: ",snowflakeId);

        if(community && community.owner === owner_id){
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
        } else{
            // owner is not verified
            return {
                status: false,
                error: 'NOT_ALLOWED_ACCESS' 
            }
        }
    } catch (error) {
        console.log("Error in adding member:", error);
    }
}
