import { PrismaClient } from '@prisma/client'
import { Snowflake } from "@theinternetfolks/snowflake";


const prisma = new PrismaClient()

export default async function main(name:String) {
  // ... you will write your Prisma Client queries here
  // await ;
  const snowflakeId = Snowflake.generate();
  console.log("Sid for Role: ",snowflakeId);
  const role = await prisma.role.create({
    data: {
      id: snowflakeId,
      name: `${name}`
    }
  })
  console.log("res of create user:", role);
  const response = {
    status:true,
    content:{
      data:role
    }
  }
  return response;
}

// main()
//   .then(async () => {
//     await prisma.$disconnect() 
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })