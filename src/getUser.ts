import { PrismaClient } from '@prisma/client'
import { Snowflake } from "@theinternetfolks/snowflake";
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export default async function main(email ,password) {
  // ... you will write your Prisma Client queries here
  // await ;
    //   const users = await prisma.user.findMany({});
    //   console.log("users:", users)

    const user = await prisma.user.findUnique({ 
        where: { email } 
    });

  if(!user){
    // return res.json({ status: false, message: 'Invalid credentials' });
    return false;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid){
    return false;
  }

  return user;
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