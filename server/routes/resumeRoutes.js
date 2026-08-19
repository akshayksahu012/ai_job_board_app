import { Router } from 'express';
import {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
  findMatchingJobs,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getMyResumes);
router.get('/:id', protect, getResumeById);
router.get('/:id/matches', protect, findMatchingJobs);
router.delete('/:id', protect, deleteResume);

export default router;
