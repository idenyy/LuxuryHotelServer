import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './user.model.js';
import Room from './room.model.js';

class Review extends Model {
  declare id: number;
  declare userId: number;
  declare rootType: string;
  declare rating: number;
  declare comment?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    roomType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true
  }
);
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Room.hasMany(Review, { foreignKey: 'roomId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

export default Review;
