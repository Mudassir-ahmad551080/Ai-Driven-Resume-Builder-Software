import express from 'express';
import cors from 'cors';
import userRouter from '../routes/userroutes.js';
import resumeRouter from '../routes/resumeroutes.js';
import aiRouter from '../routes/airoutes.js';

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://resume-frontend-psi-one.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// ✅ Handle preflight requests for ALL routes
app.options(/(.*)/, cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;