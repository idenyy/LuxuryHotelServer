import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  username: process.env.PG_USER || 'root1',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'hotelserver',
  password: process.env.PG_PASSWORD || 'root',
  port: Number(process.env.PG_PORT) || 5432
});

const connectPostgres = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(`PostgreSQL connected`);
  } catch (error: any) {
    console.error(`Error connecting to PostgreSQL: ${error.message}`);
    process.exit(1);
  }
};

export default connectPostgres;
