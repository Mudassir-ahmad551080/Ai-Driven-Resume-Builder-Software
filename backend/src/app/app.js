import express from 'express';
import userRouter from '../routes/userroutes.js';
import resumeRouter from '../routes/resumeroutes.js';
import aiRouter from '../routes/airoutes.js';
import cors from 'cors';

const app = express();

// ✅ Allow your frontend Vercel URL
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://resume-frontend-psi-one.vercel.app' // ← replace with your actual frontend URL
  ],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;
