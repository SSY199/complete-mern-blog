import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO)
 .then(() => console.log('MongoDB connected...'))
 .catch(err => console.log(err));

const app = express();

app.listen(5353, () => {
  console.log('Server is running on port 5353');
});

app.use('/api/user', userRoutes);