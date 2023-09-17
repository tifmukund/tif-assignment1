import { PrismaClient } from '@prisma/client'
import { Snowflake } from "@theinternetfolks/snowflake";


const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  // await ;
  const snowflakeId = Snowflake.generate();
  console.log("Sid for community: ",snowflakeId);
  await prisma.community.create({
    data:{
        id: snowflakeId,
        name: "dsfsg",
        slug:" xxsecretxxxxxx",
        useref:{
            connect:{
                id: "7109201249130404923"
            }
        }

    }
  })

}

main()
// main()
//   .then(async () => {
//     await prisma.$disconnect() 
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })