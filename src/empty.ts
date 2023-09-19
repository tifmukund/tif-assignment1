// import roleRoutes from "./routes/roleRoutes"
// import userRoutes from './routes/userRoutes';
// import communityRoutes from './routes/communityRoutes';
// import memberRoutes from './routes/memberRoutes';

// app.use('/v1/role', roleRoutes);
// app.use('/v1/auth', userRoutes);
// app.use('/v1/community', communityRoutes);
// app.use('/v1/member', memberRoutes);


//owner      String
// useref     User     @relation(fields: [owner], references: [id])

//the owner field in the Community model will be used to store a reference to a user
//useref User @relation(fields: [owner], references: [id]): This line defines a relation between the Community model and the User model. It specifies that the useref field in the Community model is related to the id field in the User model.