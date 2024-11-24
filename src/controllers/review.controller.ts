import { Request, Response } from 'express';

import Review from '../models/review.model.js';
import User from '../models/user.model.js';
import Booking from '../models/booking.model.js';

export const create = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { roomId, roomType, rating, comment } = req.body;

  try {
    const bookingExists = await Booking.findOne({
      where: { userId, roomId }
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
      roomType,
      rating,
      comment
    });

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
  const { roomType } = req.params;

  try {
    const reviews = await Review.findAll({
      where: { roomType },
      include: {
        model: User,
        as: 'user',
        attributes: ['name']
      }
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / totalReviews : 0;

    return res.status(200).json({
      reviews,
      averageRating
    });
  } catch (error: any) {
    console.error(`Error in [getRoomReviews]: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
