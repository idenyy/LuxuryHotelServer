import { Request, Response } from 'express';
import Room from '../models/room.model.js';
import { Booking } from '../models/booking.model.js';
import { Op } from 'sequelize';

export const checkOut = async (req: Request, res: Response): Promise<any> => {
  const { checkInDate, checkOutDate, beds } = req.body;

  try {
    if (!checkInDate || !checkOutDate || !beds) {
      return res.status(400).json({ error: 'Missing required fields: checkInDate, checkOutDate, or beds' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) return res.status(400).json({ error: 'Check-out date must be later than check-in date' });

    const rooms = await Room.findAll({
      where: {
        beds: beds,
        isAvailable: true,
      },
      include: {
        model: Booking,
        as: 'bookings',
        where: {
          [Op.or]: [{ checkInDate: { [Op.gte]: checkOut } }, { checkOutDate: { [Op.lte]: checkIn } }],
        },
        required: false,
      },
    });

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'No available rooms found for the selected dates and beds.' });
    }

    return res.status(200).json({ availableRooms: rooms });
  } catch (error: any) {
    console.error(`Error in [checkOut]: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const bookRoom = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { roomId, checkInDate, checkOutDate, extraServices } = req.body;

  try {
    if (!userId) return res.status(401).json({ error: 'Unauthorized: User not authenticated.' });

    if (!roomId || !checkInDate || !checkOutDate) return res.status(400).json({ error: 'Missing required fields: roomId, checkInDate, checkOutDate, or guestName' });

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) return res.status(400).json({ error: 'Check-out date must be later than check-in date' });

    const room = await Room.findOne({
      where: { id: roomId },
      include: {
        model: Booking,
        as: 'bookings',
        where: {
          [Op.or]: [
            { checkInDate: { [Op.between]: [checkIn, checkOut] } },
            { checkOutDate: { [Op.between]: [checkIn, checkOut] } },
            {
              checkInDate: { [Op.lte]: checkIn },
              checkOutDate: { [Op.gte]: checkOut },
            },
          ],
        },
        required: false,
      },
    });

    if (!room) return res.status(404).json({ error: 'Room unavailable for the selected dates' });

    const days = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
    const price = room.price * days;

    const booking = await Booking.create({
      userId,
      roomId: room.id,
      price,
      extraServices: extraServices || null,
      checkInDate: checkIn,
      checkOutDate: checkOut,
    });

    await room.update({ isAvailable: false });

    return res.status(201).json({ message: 'Room booked successfully!', booking });
  } catch (error: any) {
    console.error(`Error in [bookRoom]: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
