import { PrismaClient } from "@prisma/client";
import Logger from "./logger";
class Database{
    static instance:PrismaClient;

    static async Loader(){
        if (!this.instance) {
            this.instance = new PrismaClient();

            try {
                await this.instance.$connect();
                Logger.instance.info("Connected to the database");
            } catch (error) {
                Logger.instance.error("Error connecting to the database:", error);
                throw error;
            }
        }
    }
    
}

export default Database; 