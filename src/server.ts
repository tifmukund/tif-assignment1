import express from 'express'
import roleRoutes from "./api/v1/roleRoutes"
import authRoutes from './api/v1/authRoutes';
import communityRoutes from './api/v1/communityRoutes';
import memberRoutes from './api/v1/memberRoutes';
import FrameworkLoader from './loaders/v1/framework';
import Logger from './loaders/v1/logger';
import Env from './loaders/v1/env';
import Database from './loaders/v1/database';

const server = async (): Promise<express.Application> => {
    const app = express();
    //Loaders
    Logger.Loader();
    Env.Loader();
    await Database.Loader();
    await FrameworkLoader(app);
  
    //Middlewares
  
    //Routes
    app.use('/v1/role', roleRoutes);
    app.use('/v1/auth', authRoutes);
    app.use('/v1/community', communityRoutes);
    app.use('/v1/member', memberRoutes);
    return app;
};
  
  export default server;