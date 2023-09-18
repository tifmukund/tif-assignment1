import { PrismaClient } from '@prisma/client'
import { Snowflake } from "@theinternetfolks/snowflake";


const prisma = new PrismaClient()

export default async function main(ownerId, name) {
    try {
        // creating  slug from COMMUNITY name
        const created_slug = `${name}-${Math.random().toString(36).substring(2, 10)}`;

        const snowflakeId = Snowflake.generate();
        console.log("Sid for community: ",snowflakeId);


        const community = await prisma.community.create({
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
        console.log("Error in creating community:", error);
        return false;
    }
  // ... you will write your Prisma Client queries here
  // await ;
  

}

// main()
// main()
//   .then(async () => {
//     await prisma.$disconnect() 
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })