import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './user.model.js';
import Room from './room.model.js';

class Booking extends Model {
  declare id: number;
  declare userId: number;
  declare roomId: number;
  declare price: number;
  declare extraServices?: string[];
  declare status?: string;
  declare checkInDate: Date;
  declare checkOutDate: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Room,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    extraServices: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'active',
    },
    checkInDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOutDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true,
  }
);

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Room.hasMany(Booking, { foreignKey: 'roomId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

export default Booking;
