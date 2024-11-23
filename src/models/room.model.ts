import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import Booking from './booking.model.js';
import Review from './review.model.js';

class Room extends Model {
  declare id: number;
  declare number: number;
  declare type: string;
  declare price: number;
  declare description?: string;
  declare beds: number;
  declare isAvailable: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare Bookings?: Booking[];
  declare Reviews?: Review[];
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    beds: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    Reviews: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
      defaultValue: []
    }
  },
  {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms',
    timestamps: true
  }
);

export default Room;
