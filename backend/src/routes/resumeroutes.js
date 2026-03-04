import express from 'express';
import protect from '../middleware/authmiddleware.js';
import { createResume, deleteResume, getResumeByIdPublic, getRusumeById, updateResume } from '../controllers/ResumeController.js';
import upload from '../middleware/multer.js';

const resumeRouter = express.Router();


resumeRouter.post('/create',protect,createResume);
resumeRouter.put('/update',upload.single('image'),protect,updateResume)
resumeRouter.delete('/delete/:resumeId',protect,deleteResume);
resumeRouter.get('/get/:resumeId',protect,getRusumeById)
resumeRouter.get('/public/:resumeId',getResumeByIdPublic);

export default resumeRouter;