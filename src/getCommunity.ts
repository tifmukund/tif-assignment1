import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

export default async function main(page, pageSize) {
    try {
    
    const offset:number = (page - 1) * pageSize;

    const totalCount = await prisma.community.count();

    const totalPages = Math.ceil(totalCount / pageSize);

    //all com, & owner slected info

    //I MADE A typo, useref instead of userref
    const communities  = await prisma.community.findMany({
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
        console.log("error in getting community:", error)
        return {
             status: false,
              error: 'Internal Server Error on Get Communities' 
        };
    }
}