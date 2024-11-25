import { Request, Response } from 'express';
import Room from '../models/room.model.js';
import Booking from '../models/booking.model.js';
import Table from '../models/table.model.js';

export const getBookings = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;

  try {
    if (!userId) return res.status(401).json({ error: 'Unauthorized: User not authenticated.' });

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['number', 'type', 'description', 'capacity']
        },
        {
          model: Table,
          as: 'table',
          attributes: ['number', 'price']
        }
      ],
      order: [['checkInDate', 'ASC']]
    });

    if (!bookings || bookings.length === 0) return res.status(404).json({ message: 'No bookings found for this user.' });

    return res.status(200).json(bookings);
  } catch (error: any) {
    console.error(`Error in [getUserBookings]: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
