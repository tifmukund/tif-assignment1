import { PrismaClient } from '@prisma/client'
import { Snowflake } from "@theinternetfolks/snowflake";


const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  // await ;
  const snowflakeId = Snowflake.generate();
  console.log("Sid for Role: ",snowflakeId);
  await prisma.role.create({
    data: {
      id: snowflakeId,
      name: "admin"
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