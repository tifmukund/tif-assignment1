import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function main(pageSize, page, userId) {
    try {
        // skip
        const offset = (page - 1) * pageSize;

        //  total count of joined communities
        const totalJoinedCommunities = await prisma.member.count({
            where: {
                user: userId,
            },
            });
        
        const totalPages = Math.ceil(totalJoinedCommunities / pageSize);

        // get all rows where user is member, then using community ref, get details of that com, further using userref inside it get the owner id & name
        const joinedCommunities = await prisma.member.findMany({
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
        console.log("Error in removing member:", error);
        return {status: false, error:"Error getting Owned Community"}
    }
}
