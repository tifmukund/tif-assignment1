import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function main(pageSize, page, userId) {
    try {
        const offset = (page - 1) * pageSize;

        // Getting all owner Communiteis
        const owned = await prisma.community.findMany({
        where: {
            owner: userId, // Filter by the user's ID
        },
        skip: offset,
        take: pageSize,
        });

        if(!owned){
            return {status: false, error:"User does not have any communities"}
        }
        //count communities he owns
        const totalowned = await prisma.community.count({
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
        console.log("Error in removing member:", error);
        return {status: false, error:"Error getting Owned Community"}
    }
}
