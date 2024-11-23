import { Request, Response } from 'express';

import Review from '../models/review.model.js';
import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import Room from '../models/room.model.js';

export const create = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { roomId, rating, comment } = req.body;

  try {
    const bookingExists = await Booking.findOne({
      where: {
        userId,
        roomId
      }
    });
    if (!bookingExists) return res.status(403).json({ error: 'You cannot leave a review for a room you have not booked' });

    const reviewExists = await Review.findOne({
      where: {
        userId,
        roomId
      }
    });
    if (reviewExists) return res.status(409).json({ error: 'You have already left a review for this room' });

    const review = await Review.create({
      userId,
      roomId,
      rating,
      comment,
      createdAt: new Date()
    });

    const room = await Room.findByPk(roomId);
    if (room) {
      const updatedReviews = [...(room.Reviews || []), review];
      await room.update({ Reviews: updatedReviews });
    }

    return res.status(201).json({
      message: 'Review successfully created',
      review
    });
  } catch (error: any) {
    console.error(`Error in [createReview]: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getRoomReviews = async (req: Request, res: Response): Promise<any> => {
  const { roomId } = req.params;

  try {
    const reviews = await Review.findAll({
      where: { roomId },
      include: {
        model: User,
        as: 'user',
        attributes: ['name']
      }
    });

    return res.status(200).json({
      reviews
    });
  } catch (error: any) {
    console.error(`Error in [getRoomReviews]: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getRoomRating = async (roomId: number) => {
  const room = await Room.findOne({
    where: { id: roomId },
    include: {
      model: Review,
      as: 'reviews',
      attributes: ['rating']
    }
  });

  if (room) {
    const totalReviews = room.Reviews?.length || 0;
    const averageRating = totalReviews > 0 ? room.Reviews!.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

    room.setDataValue('averageRating', averageRating);
  }

  return room;
};
