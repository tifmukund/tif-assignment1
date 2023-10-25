import express from "express"
import { validateSignup } from "../../middleware/validator";
import jwt from "jsonwebtoken";
import AuthService from "../../services/AuthService";
import Logger from "../../loaders/v1/logger";

// Define a custom interface that extends Request
interface CustomRequest extends express.Request {
    // Add your custom properties here
    user: {
      id: string;
      name: string;
      email: string;
      created_at: Date;
    };
  }

class AuthController{
    static async signup(req:express.Request, res: express.Response){
        try {
            const {error, value} = validateSignup(req.body)
        if(error){
            return res.json({
            status:false,
            error:error.details[0].message[0].message
            })
            return;
        }
        const {name, email, password} = req.body;

        const savedUser = await AuthService.createUser(name, email, password);

        const payload = { 
            id: savedUser.id,
            name:savedUser.name,
            email: savedUser.email, 
            created_at:savedUser.created_at 
        }
    
        // acc token
        const accessToken = jwt.sign(
          payload,
          process.env.JWT_SECRET1,
          { expiresIn: '1h' } 
        );
    
        res.cookie("token", accessToken, {
            httpOnly: true,
            maxAge: 3600000,
        })
    
        const response = {
          status: true,
          content: {
            data: {
              id: savedUser. id,
              name: savedUser.name,
              email: savedUser.email,
              created_at: savedUser.created_at,
            },
            meta: {
              access_token: accessToken,
            },
          },
        };
    
        res.status(201).json(response);
        } catch (error) {
            res.status(500).json({ status: false, message: 'Internal server error' });
        }

        
    }

    static async signin(req:express.Request, res: express.Response){
        try {
            const { email, password } = req.body;
            const user = await AuthService.getUser(email, password);
            //for both if user not found or pass is incorrect
            // if(!user){
            //     return res.status(401).json({ status: false, message: 'Invalid credentials' });
            // }
            const payload = {
                id:user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at
            }

            //gen token
            const token = jwt.sign(payload, process.env.JWT_SECRET1, { expiresIn: '1h' });

            // //cookie set
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 3600000,
            })
        
            const responseData = {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
            };
        
            res.json({
            status: true,
            content: {
                data: responseData,
                meta: {
                access_token: token,
                },
            },
            });

            
        } catch (error) {
            
            res.status(500).json({ status: false, message: 'Internal server error' });
        }
    }

    static async myProfile(req:CustomRequest, res: express.Response){
        try {
            const { id, name, email, created_at } = await req.user;

            // console.log(req.user);
            const responseData = {
                id,
                name,
                email,
                created_at,
            };

            res.json({
                status: true,
                content: {
                data: responseData,
                },
            });
        } catch (error) {
            res.status(500).json({ status: false, message: 'Internal server error' });
        }
        
    }
}

export default AuthController