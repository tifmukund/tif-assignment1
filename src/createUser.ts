import { PrismaClient } from '@prisma/client'
import { Snowflake } from "@theinternetfolks/snowflake";


const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  // await ;
  const snowflakeId = Snowflake.generate();
  console.log("Sid for User: ",snowflakeId);
  await prisma.user.create({
    data:{
        id: snowflakeId,
        name: "dsfsg",
        email: "chotu@gmail.com",
        password: "qweasd"

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