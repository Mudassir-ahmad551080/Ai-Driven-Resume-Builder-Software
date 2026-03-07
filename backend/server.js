import 'dotenv/config';
import connectDB from './src/db/db.js';
import app from './src/app/app.js';

// ✅ This runs at import time — works on both Vercel and local
await connectDB();

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;