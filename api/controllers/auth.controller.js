import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/errorHandler.js'

export const signup = async (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });

  try {
    await newUser.save();
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};