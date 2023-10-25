import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from "helmet";

const FrameworkLoader = async(app: express.Application) =>{
    app.use(helmet());
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser()); 
}

export default FrameworkLoader;