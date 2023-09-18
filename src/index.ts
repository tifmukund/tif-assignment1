import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { Snowflake } from "@theinternetfolks/snowflake";
import express from "express";
import { Request, Response, NextFunction } from 'express';
import createRole from "./createRole";
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieAuth from "./middleware/cookieJwtAuth";
import createUser from "./createUser";
import getUser from "./getUser"
import createCommunity from "./createCommunity"



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

//interfaces, enums &types

interface CustomRequest extends Request {
    user?: any; // change this to only include id, name, email
  }

app.post('/v1/role',cookieAuth,async (req, res) =>{
    const {name} = req.body;
    // console.log(req);
    console.log("name role:",name)
    if(name !== "Community Admin" && name !== "Community Member"){
        return res.json({
            status:false,
            message:"Please select name: Community Admin or Community Member"
        })
    }
    //add validation, min len 2
    return createRole(name);

})
app.get('/v1/role',async (req, res) => {
    try{
    let page:number = 1;
    let pageSize:number = 10;
    // const { page, pageSize} = req.query;
    const offset:number = (page - 1) * pageSize;

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

    res.json(response);
  } catch (error) {
    console.error("error getting all roles & meta",error);
    res.status(500).json({ status: false, error: 'Internal Server Error on Get All' });
  }
})

app.post('/v1/auth/signup',async (req, res) =>{
    // Check for validation errors
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ status: false, errors: errors.array() });
//   }

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create and save the user in your database
    const {name, email, password} = req.body;
    const savedUser = await createUser(name, email, hashedPassword)

    //
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
    console.error('Error creating user:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
})

app.post('/v1/auth/signin',async (req, res) => {
    const { email, password } = req.body;
  
    const user = await getUser(email, password);

    //for both if user not found or pass is incorrect
    if(!user){
        return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }

    // res.status(201).json(user);
  
    //payload without user pass
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

});

//run after /auth/signin to set cookie
app.get('/v1/auth/me',cookieAuth, async (req:CustomRequest, res:Response) => {
    //if I was using header for authentication
    //const token = req.header('Authorization');

    const { id, name, email, created_at } = await req.user;

    console.log(req.user);
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
})

app.post('/v1/community',cookieAuth,async (req:CustomRequest, res) => {
    try {
        // Extract the user's ID from the access token (you should implement this)
        const ownerId = req.user.id;
        console.log("Current user id who wants to create a community:", ownerId);

        // Extract community data from the request body
        const { name } = req.body;
        const response = await createCommunity(ownerId, name);
        
        if(!response){
            res.status(500).json({ status: false, message: 'Cannot create community' });
        }
        return response;
    } catch (error) {
        res.status(500).json({ status: false, message: 'Internal server error at creating community' });
    }
    
})


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
