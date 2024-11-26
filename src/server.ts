import app from './app.js';
import cron from 'node-cron';
import { updateRoomAvailability } from './controllers/booking.controller';

const PORT = process.env.PORT || 5000;

cron.schedule(
  '*/1 * * * *',
  async () => {
    console.log('Running room availability update...');
    await updateRoomAvailability();
  },
  {
    timezone: 'Europe/Kyiv'
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
