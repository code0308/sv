import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { connectToDatabase } from './shared/database/connection';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Sale con código de error
  }
};

startServer();
