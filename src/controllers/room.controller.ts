import { Request, Response } from 'express';
import Room from '../models/room.model.js';

export const create = async (req: Request, res: Response): Promise<any> => {
  const { number, type, description, capacity } = req.body;

  if (!number || !type || !capacity) return res.status(400).json({ message: 'Missing required fields' });

  try {
    const room = await Room.findOne({ where: { number } });

    if (room) return res.status(400).json({ error: 'Room already exists' });

    const newRoom = await Room.create({
      number,
      type,
      description,
      capacity
    });

    return res.status(201).json(newRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
