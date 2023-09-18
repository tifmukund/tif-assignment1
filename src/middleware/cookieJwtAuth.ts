import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
    user?: any; // change this to only include id, name, email
  }

const cookieAuth = async (req: CustomRequest, res: Response, next:NextFunction) => {
    //getting token from cookie
    

    try {
        const token= await req.cookies.token;
        console.log("Checking cookie with token");
        const user = jwt.verify(token, process.env.JWT_SECRET1);
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.status(401).json({ status: false, message: 'Unauthorized' });
    }
}


export default cookieAuth;