import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieAuth from '../middleware/cookieJwtAuth';

import { validateSignup } from '../middleware/validator';
import { Request, Response, NextFunction } from 'express';
import createUser from '../createUser'
import getUser from '../getUser'

interface CustomRequest extends Request {
  user?: any; // change this to only include id, name, email
}
let router = express.Router();


router.post('/signup', async (req, res) => {
    // validation
  // stop at first invalid
  const {error, value} = validateSignup(req.body)
  if(error){
    return res.json({
      status:false,
      error:error.details[0].message[0].message
    })
    return;
  }

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
  });
  
  // Get all roles
router.post('/signin',async (req, res) => {
    try {
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
    } catch (error) {
        console.log("Error in /auth/signin")
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

router.get('/me',cookieAuth, async(req:CustomRequest, res:Response) =>{
  try {
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
  } catch (error) {
    console.log("Error in /auth/me")
    res.status(500).json({ status: false, message: 'Internal server error' });
  }

})
  
  export default router;