import jwt from 'jsonwebtoken';
import {Response} from "express";

export const generateToken = (id: number, res: Response) => {
  const token: string = jwt.sign({ id }, process.env.JWT_SECRET || '', {
    expiresIn: '15d'
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
