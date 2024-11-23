import User from './user.model.js';
import Room from './room.model.js';
import Review from './review.model.js';
import Booking from './booking.model.js';

// User
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Room
Room.hasMany(Booking, { foreignKey: 'roomId', as: 'bookings' });
Room.hasMany(Review, { foreignKey: 'roomId', as: 'reviews' });
Booking.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });
Review.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

export { User, Room, Review, Booking };
