import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
  
export default async function main(page, pageSize, offset) {
      try {
      
        const roles = await prisma.role.findMany({
            skip: offset,
            take: pageSize,
          });
        
        const totalCount = await prisma.role.count();
        
        const totalPages = Math.ceil(totalCount / pageSize);
        
        const response = {
            status: true,
            content: {
              meta: {
                total: totalCount,
                pages: totalPages,
                page: page,
              },
              data: roles,
            },
          };
        return response;
      
      }catch(error){
          console.log("error in getting roles:", error)
          return {
               status: false,
                error: 'Internal Server Error on Get Roles' 
          };
      }
  }