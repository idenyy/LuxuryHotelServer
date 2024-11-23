import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import Booking from './booking.model.js';

class Table extends Model {
  declare id: number;
  declare number: number;
  declare capacity: number;
  declare price: number;
  declare isAvailable: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare Bookings?: Booking[];
}

Table.init(
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
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    price: {
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
    modelName: 'Table',
    tableName: 'tables',
    timestamps: true
  }
);

export default Table;
