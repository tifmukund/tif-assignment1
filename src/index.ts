import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from 'cookie-parser';
import roleRoutes from "./routes/roleRoutes"
import authRoutes from './routes/authRoutes';
import communityRoutes from './routes/communityRoutes';
import memberRoutes from './routes/memberRoutes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.use('/v1/role', roleRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/community', communityRoutes);
app.use('/v1/member', memberRoutes);

//Set header in postman for json






const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
