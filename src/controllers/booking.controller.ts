import { Request, Response } from 'express';
import { Op } from 'sequelize';

import Room from '../models/room.model.js';
import Booking from '../models/booking.model.js';
import Table from '../models/table.model.js';

export const checkOutRoom = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { checkInDate, checkOutDate, beds, extraServices, type, price } = req.body;

  try {
    if (!userId) return res.status(401).json({ error: 'Unauthorized: User not authenticated.' });

    if (!checkInDate || !checkOutDate || !beds) return res.status(400).json({ error: 'Missing required fields: checkInDate, checkOutDate, or beds' });

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) return res.status(400).json({ error: 'Check-out date must be later than check-in date' });

    const room = await Room.findOne({
      where: { type: type, beds, isAvailable: true },
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

    if (!room) return res.status(404).json({ error: 'No available rooms with the specified number of beds and dates.' });

    const existingBooking = await Booking.findOne({
      where: {
        userId,
        roomId: room.id,
        checkInDate: { [Op.lte]: checkOut },
        checkOutDate: { [Op.gte]: checkIn },
        status: 'active'
      }
    });
    if (existingBooking) return res.status(400).json({ error: 'You already have a booking for this room during these dates.' });

    const booking = await Booking.create({
      userId,
      roomId: room.id,
      price: price,
      extraServices: extraServices || [],
      checkInDate: checkIn,
      checkOutDate: checkOut
    });

    await room.update({ isAvailable: false });

    return res.status(201).json({ message: 'Room booked successfully!', booking });
  } catch (error: any) {
    console.error('Error in [checkOut]:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map((e: any) => e.message)
      });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const checkOutTable = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { checkInDate, capacity } = req.body;

  try {
    if (!userId) return res.status(401).json({ error: 'Unauthorized: User not authenticated.' });

    if (!checkInDate || !capacity) return res.status(400).json({ error: 'Missing required fields: checkInDate or capacity' });

    const checkIn = new Date(checkInDate);

    const table = await Table.findOne({
      where: { capacity, isAvailable: true },
      include: {
        model: Booking,
        as: 'bookings',
        where: {
          checkInDate: { [Op.lte]: checkInDate },
          checkOutDate: { [Op.gte]: checkInDate }
        },
        required: false
      }
    });

    if (!table) return res.status(404).json({ error: 'No available table with the specified capacity.' });

    const existingBooking = await Booking.findOne({
      where: {
        userId,
        tableId: table.id,
        checkInDate: { [Op.lte]: checkIn },
        status: 'active'
      }
    });

    if (existingBooking) return res.status(400).json({ error: 'You already have a booking for this table at the specified time.' });

    const booking = await Booking.create({
      userId,
      tableId: table.id,
      price: table.price,
      checkInDate: checkIn,
      checkOutDate: null
    });

    await table.update({ isAvailable: false });

    return res.status(201).json({
      message: 'Table booked successfully',
      booking
    });
  } catch (error: any) {
    console.error('Error in [bookTable]:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const endTable = async (req: Request, res: Response): Promise<any> => {
  const { bookingId } = req.params;

  if (!bookingId) return res.status(400).json({ error: 'Missing required field: bookingId' });

  try {
    const booking = await Booking.findOne({
      where: { id: bookingId, checkOutDate: null }
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found or already completed.' });

    const checkIn = new Date(booking.checkInDate);
    const currentTime = new Date();

    const timeDifference = currentTime.getTime() - checkIn.getTime();
    const hours = timeDifference / (1000 * 60 * 60);
    const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;

    let timeDisplay;
    hours >= 1 ? (timeDisplay = `${Math.floor(hours)} hours ${minutes} minutes`) : (timeDisplay = `${minutes} minutes`);

    const price = Math.round(booking.price * hours);

    await booking.update({
      checkOutDate: currentTime,
      price: price,
      status: 'completed'
    });

    const table = await Table.findByPk(booking.tableId);
    await table?.update({ isAvailable: true });

    const receipt = {
      bookingId: booking.id,
      tableId: booking.tableId,
      checkInDate: booking.checkInDate,
      checkOutDate: currentTime,
      time: timeDisplay,
      amount: price
    };

    return res.status(200).json({
      message: 'Booking completed successfully.',
      receipt: receipt
    });
  } catch (error: any) {
    console.error('Error in [endBooking]:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const cancel = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { bookingId } = req.body;

  try {
    if (!userId) return res.status(401).json({ error: 'Unauthorized: User not authenticated' });

    const booking = await Booking.findOne({
      where: { id: bookingId, userId },
      include: [
        {
          model: Room,
          as: 'room'
        }
      ]
    });

    if (!booking) return res.status(404).json({ error: 'Booking Not Found' });

    booking.status = 'canceled';
    await booking.save();

    await booking.room?.update({ isAvailable: true });

    return res.status(200).json({ message: 'Booking canceled successfully', booking });
  } catch (error: any) {
    console.error(`Error in [cancel]: ${error.message}`);
  }
};

export const updateRoomAvailability = async () => {
  try {
    const bookings = await Booking.findAll({
      where: {
        checkOutDate: { [Op.lte]: new Date() },
        tableId: null,
        status: 'active'
      }
    });

    for (const booking of bookings) {
      const room = await Room.findByPk(booking.roomId);

      if (room) {
        if (!room.isAvailable) {
          await room.update({ isAvailable: true });
          console.log(`Room ${room.id} is now available`);
        }

        await booking.update({ status: 'completed' });
      } else {
        console.error(`Room with ID:${booking.roomId} Not Found`);
      }
    }
  } catch (error) {
    console.error('Error updating room availability:', error);
  }
};
