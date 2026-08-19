import { Router } from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

export default router;
