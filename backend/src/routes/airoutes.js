import express from 'express';
import multer from 'multer';
import protect from '../middleware/authmiddleware.js';
import {
  enhanceJobDescription,
  generateResumeFromChat,
  enhanceProfessionalSummary,
  uploadResume,
  analyzeResume,
  startInterview,
  respondToAnswer,      // ← ADD THIS
  parsePdfResume        // ← ADD THIS
} from '../controllers/aicontroller.js';

const aiRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // ← store PDF in memory

aiRouter.post('/enhance-pro-summ', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);
aiRouter.post('/upload-resume', protect, uploadResume);
aiRouter.post('/generate-from-chat', protect, generateResumeFromChat);
aiRouter.post('/analyze-resume', analyzeResume);

// ── Interview routes ──────────────────────────────────────────
aiRouter.post('/interview-prep', startInterview);           // start (text)
aiRouter.post('/interview-parse-pdf', upload.single('file'), parsePdfResume); // ← separate PDF route
aiRouter.post('/interview-respond', respondToAnswer);       // ← respond route

export default aiRouter;