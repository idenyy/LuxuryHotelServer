import { Request, Response } from 'express';
import Room from '../models/room.model.js';
import Booking from '../models/booking.model.js';
import { Op } from 'sequelize';

export const checkOut = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { checkInDate, checkOutDate, beds, extraServices } = req.body;

  try {
    if (!userId) return res.status(401).json({ error: 'Unauthorized: User not authenticated.' });

    if (!checkInDate || !checkOutDate || !beds) {
      return res.status(400).json({ error: 'Missing required fields: checkInDate, checkOutDate, or beds' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) return res.status(400).json({ error: 'Check-out date must be later than check-in date' });

    const room = await Room.findOne({
      where: { beds: beds, isAvailable: true },
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

    if (!room) return res.status(404).json({ error: 'No available rooms with the specified number of beds and dates.' });

    const existingBooking = await Booking.findOne({
      where: { userId, roomId: room.id, checkInDate: { [Op.lte]: checkOut }, checkOutDate: { [Op.gte]: checkIn } },
    });
    if (existingBooking) return res.status(400).json({ error: 'You already have a booking for this room during these dates.' });

    const days = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
    const price = room.price * days;

    const booking = await Booking.create({
      userId,
      roomId: room.id,
      price,
      extraServices: extraServices || [],
      checkInDate: checkIn,
      checkOutDate: checkOut,
    });

    await room.update({ isAvailable: false });

    return res.status(201).json({ message: 'Room booked successfully!', booking });
  } catch (error: any) {
    console.error(`Error in [checkOut]: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateRoomAvailability = async () => {
  try {
    const bookings = await Booking.findAll({
      where: {
        checkOutDate: { [Op.lte]: new Date() },
        status: 'active',
      },
    });

    for (const booking of bookings) {
      const room = await Room.findByPk(booking.roomId);
      if (room && !room.isAvailable) {
        await room.update({ isAvailable: true });
        console.log(`Room ${room.id} is now available.`);
      }
      // Оновлюємо статус бронювання на завершене (необов'язково)
      await booking.update({ status: 'completed' });
    }
  } catch (error) {
    console.error('Error updating room availability:', error);
  }
};
