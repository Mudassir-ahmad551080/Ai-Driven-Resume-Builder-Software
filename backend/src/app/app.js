import express from 'express';
import userRouter from '../routes/userroutes.js';
import resumeRouter from '../routes/resumeroutes.js';
import aiRouter from '../routes/airoutes.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));                           // ✅ increased
app.use(express.urlencoded({ extended: true, limit: "10mb" }));    // ✅ add this

app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;