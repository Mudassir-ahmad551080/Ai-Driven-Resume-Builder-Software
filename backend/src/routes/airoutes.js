import express from 'express';
import protect from '../middleware/authmiddleware.js';
import {
  enhanceJobDescription,
  generateResumeFromChat,
  enhanceProfessionalSummary,
  uploadResume,
  analyzeResume,
  startInterview,
  respondToAnswer,

} from '../controllers/aicontroller.js';

const aiRouter = express.Router();


aiRouter.post('/enhance-pro-summ', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);
aiRouter.post('/upload-resume', protect, uploadResume);
aiRouter.post('/generate-from-chat', protect, generateResumeFromChat);
aiRouter.post('/analyze-resume', analyzeResume);
aiRouter.post('/interview-prep', startInterview);
aiRouter.post('/interview-respond', respondToAnswer);


export default aiRouter;