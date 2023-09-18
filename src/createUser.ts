import { PrismaClient } from '@prisma/client'
import { Snowflake } from "@theinternetfolks/snowflake";


const prisma = new PrismaClient()

export default async function main(name, email, password) {
  // ... you will write your Prisma Client queries here
  // await ;
  const snowflakeId = Snowflake.generate();
  console.log("Sid for User: ",snowflakeId);

  //check before creating if email already exits
  //res.status(401).({status, message})


  let user = await prisma.user.create({
    data:{
        id: snowflakeId,
        name: `${name}`,
        email: `${email}`,
        password: `${password}`
    }
  })

  return user;



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