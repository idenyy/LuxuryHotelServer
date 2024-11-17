import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { generateToken } from '../utils/token.js';
import { sendMail } from '../utils/mail.js';
import User from '../models/user.model.js';

export const signup = async (req: Request, res: Response): Promise<any> => {
  const { fullName, email, verification_code, password } = req.body;

  try {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid Email Format' });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'User Already Exists' });
    }

    if (!req.session.verificationCode || verification_code !== req.session.verificationCode || req.session.verificationCodeUsed) {
      return res.status(400).json({ error: 'Invalid Verification Code' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    if (user) {
      const token = generateToken(user.id);
      req.session.verificationCodeUsed = true;

      const userResponse = user.toJSON();
      delete userResponse.password;

      return res.status(201).json({ token, user: userResponse });
    }
  } catch (error: any) {
    console.error(`Error in [signup] controller: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const sendVerificationCode = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    req.session.verificationCode = verificationCode;

    await sendMail(email, verificationCode);

    return res.status(200).json({ message: 'Verification Code Sent' });
  } catch (error: any) {
    console.error(`Error in [sendVerificationCode] controller: ${error.message}`);
    return res.status(500).json({ error: 'Failed to send verification code' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User Not Found' });
    }

    const isUserPasswordCorrect = await bcrypt.compare(password, user.password);

    if (user && isUserPasswordCorrect) {
      const token = generateToken(user.id);

      console.log(Promise);

      return res.status(200).json({
        token,
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      });
    }

    return res.status(400).json({ error: 'Incorrect email or password' });
  } catch (error: any) {
    console.error(`Error in [login] controller: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error(`Error in [logout] controller: ${error.message}`);
        return res.status(500).json({ error: 'Failed to log out' });
      }

      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged Out Successfully' });
    });
  } catch (error: any) {
    console.error(`Error in [logout] controller: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const authCheck = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log(req.user);
    const user = await User.findOne({ where: { id: req.user.id }, attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'User Not Found' });

    const token = generateToken(user.id);

    return res.status(200).json({ token, user });
  } catch (error: any) {
    console.error(`Error in [authCheck] controller: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
