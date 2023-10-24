// import dotenv from "dotenv";
// dotenv.config();
import Logger from "./loaders/logger";
import server from "./server";

(async () => {
  const app = await server();

  app.listen(process.env.PORT,() => { 
    Logger.instance.info(`listening on port: ${process.env.PORT}`)
  })
})

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser()); 

// app.use('/v1/role', roleRoutes);
// app.use('/v1/auth', authRoutes);
// app.use('/v1/community', communityRoutes);
// app.use('/v1/member', memberRoutes);
