import express from 'express'
import roleRoutes from "./api/roleRoutes"
import authRoutes from './api/authRoutes';
import communityRoutes from './api/communityRoutes';
import memberRoutes from './api/memberRoutes';
import FrameworkLoader from './loaders/framework';
import Logger from './loaders/logger';

const server = async (): Promise<express.Application> => {
    const app = express();
  
    //Loaders
    Logger.Loader();
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