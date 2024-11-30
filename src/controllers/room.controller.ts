import { Request, Response } from 'express';
import Room from '../models/room.model.js';
import Booking from '../models/booking.model.js';
import { Op } from 'sequelize';

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

export const getAvailable = async (req: Request, res: Response): Promise<any> => {
  const { checkInDate, checkOutDate, capacity, type } = req.body;

  if (!checkInDate || !checkOutDate || !capacity) return res.status(400).json({ error: 'Missing required fields: checkInDate, checkOutDate, or capacity' });
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  try {
    const rooms = await Room.findAll({
      where: { capacity, type, isAvailable: true },
      include: {
        model: Booking,
        as: 'bookings',
        where: {
          [Op.or]: [
            { checkInDate: { [Op.between]: [checkIn, checkOut] } },
            { checkOutDate: { [Op.between]: [checkIn, checkOut] } },
            {
              checkInDate: { [Op.lte]: checkIn },
              checkOutDate: { [Op.gte]: checkOut }
            }
          ]
        },
        required: false
      }
    });

    if (!rooms) return res.status(404).json({ error: 'Room Not Found or Not Available' });

    return res.status(201).json(rooms);
  } catch (error: any) {
    console.error(error);
  }
};
