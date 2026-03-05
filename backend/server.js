import 'dotenv/config';
import connectDB from './src/db/db.js';
import app from './src/app/app.js';

// Pehle DB connect karo, phir server start karo
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.log('MongoDB connection failed:', error);
  process.exit(1);
});

// Vercel ke liye export
export default app;