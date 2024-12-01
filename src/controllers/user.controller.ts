import { Request, Response } from 'express';
import Booking from '../models/booking.model.js';
import Room from '../models/room.model.js';
import Table from '../models/table.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { IUser } from '../types/user.type.js';

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;

  try {
    if (!userId) return res.status(401).json({ error: 'Unauthorized: User not authenticated.' });

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ message: 'User Not Found' });

    return res.status(200).json(user);
  } catch (error: any) {
    console.error(`Error in [getProfile] controller: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { name, email, currentPassword, newPassword } = req.body;

  try {
    let user: IUser | null = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User Not Found' });

    let updatedFields: Partial<IUser> = {};

    if ((!newPassword && currentPassword) || (!currentPassword && newPassword))
      return res.status(400).json({
        error: 'Please provide both [current password] and [new password]'
      });

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password as string);
      if (!isMatch)
        return res.status(400).json({
          error: 'Current password is incorrect'
        });

      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      } else if (newPassword === currentPassword) {
        return res.status(400).json({
          error: 'New password cannot be the same as the current password.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(newPassword, salt);
    }

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;

    await User.update(updatedFields, { where: { id: userId } });

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error(`Error in [updateProfile] controller: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteProfile = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User Not Found' });

    await user.destroy();

    return res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (error: any) {
    console.error(`Error in [deleteProfile] controller: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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
          attributes: ['number', 'type', 'capacity', 'description']
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
