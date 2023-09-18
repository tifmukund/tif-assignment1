import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function main(communityId, page, pageSize) {
    try {
        const skip = (page - 1) * pageSize;
        // total number of memebers in a particular community
        const totalCount = await prisma.member.count({
            where: { community: communityId },
        });
      
        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / pageSize);

        const members = await prisma.member.findMany({
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
        console.error('Error fetching community members:', error);

        return {
            status: false, message: 'Internal Server Error' 
        };
      }
}