import bcrypt from 'bcrypt';
import { Snowflake } from "@theinternetfolks/snowflake";
import Logger from '../loaders/v1/logger';
import Database from '../loaders/v1/database';

class AuthService{
    static async createUser(name:string, email:string, password:string){
        try {
            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const snowflakeId = Snowflake.generate();
            Logger.instance.info("Sid for User: ",snowflakeId);

            //check before creating if email already exits
            //res.status(401).({status, message})


            let user = await Database.instance.user.create({
                data:{
                    id: snowflakeId,
                    name: `${name}`,
                    email: `${email}`,
                    password: `${hashedPassword}`
                }
            })

            return user;
        } catch (error) {
            Logger.instance.error('Error creating user:', error);
            throw new Error("Error creating user");
        }
        

    }

    static async getUser(email:string, password:string){
        try {
            const user = await Database.instance.user.findUnique({ 
                where: { email } 
            });
        
          if(!user){
            throw new Error('No user found')
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
        
          if(!isPasswordValid){
            throw new Error('Invalid password')
          }
        
          return user;
        } catch (error) {
            Logger.instance.error('Error in getting user')
            throw new Error('Error in getting user')
        }
        
    }


}

export default AuthService;

