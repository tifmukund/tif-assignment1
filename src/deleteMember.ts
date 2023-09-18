import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function main(ownerId, memberId) {
    try {
        //get the community id from member id
        const member = await prisma.member.findUnique({
            where: {
              id: memberId,
            },
            select: {
              community: true,
            },
        });
          
        if (!member) {
            console.log('Member not found.');
            return {
                status: false,
                error:"Member ID does not exist"
            }
        }
        //checking if owner has role admin  in the communityId

        console.log("memeber exists");
        const communityId = member.community;
        console.log("Community from where to delete",communityId);
        let isAuth = false;

        //1 alternate
        const owner = await prisma.community.findUnique({
            where:{
                id:communityId,
                owner: ownerId
            }
        })

        if(!owner){
            console.log("Not authorised for signed in user")
            return {
                status: false,
                error:"NOT_ALLOWED_ACCESS"
                
            }
        }

        //2 
        // const user = await prisma.user.findUnique({
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
          

        

        const response = await prisma.member.delete({
            where: {
              id:memberId,
              community:communityId
            },
        });

        console.log("response", response)

        return response;

        
    } catch (error) {
        console.log("Error in removing member:", error);
    }
}
