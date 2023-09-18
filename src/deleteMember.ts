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

        //   console.log("role for user named:",user.name,"\n role ref:")
        // //1 checking for both Admin & Moderator
        // user.members.forEach((member) => {
        //     console.log(member.roleref);
        //     if (member.roleref.name === 'Community Admin' || member.roleref.name === 'Community Moderator') {
        //       isAuth = true;
        //     }
        // });
        // if (!isAuth) {
        //     console.log("Not authorised for signed in user")
        //     return { status: false, error:"NOT_ALLOWED_ACCESS"}
        //  }

        

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
