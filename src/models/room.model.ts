import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import Booking from './booking.model.js';

class Room extends Model {
  declare id: number;
  declare number: number;
  declare type: string;
  declare description?: string;
  declare capacity: number;
  declare isAvailable: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare Bookings?: Booking[];
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
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
