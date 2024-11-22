import { Request, Response } from 'express';
import Room from '../models/room.model.js';

export const add = async (req: Request, res: Response): Promise<any> => {
  const { number, type, price, description, beds } = req.body;

  if (!number || !type || !price || !beds) return res.status(400).json({ message: 'Missing required fields' });

  try {
    const room = await Room.findOne({ where: { number } });

    if (room) return res.status(400).json({ error: 'Room already exists' });

    const newRoom = await Room.create({
      number,
      type,
      price,
      description,
      beds,
    });

    return res.status(201).json(newRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
