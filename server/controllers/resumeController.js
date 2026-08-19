import fs from 'fs';
import Resume from '../models/Resume.js';
import { extractText } from '../utils/extractText.js';
import { parseResume, searchMatchingJobs } from '../services/aiServiceClient.js';

export async function uploadResume(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const rawText = await extractText(req.file.path, req.file.mimetype);
    if (!rawText.trim()) {
      fs.unlinkSync(req.file.path);
      return res.status(422).json({ message: 'Could not extract text from resume' });
    }

    // Python AI service (LangChain + Gemini) pulls out skills + a likely job title
    const parsed = await parseResume(rawText);

    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      rawText,
      skills: parsed.skills,
      jobTitle: parsed.jobTitle,
    });

    fs.unlink(req.file.path, () => {});

    res.status(201).json(resume);
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  }
}

export async function getMyResumes(req, res, next) {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).select('-rawText').sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    next(err);
  }
}

export async function getResumeById(req, res, next) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (String(resume.userId) !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(resume);
  } catch (err) {
    next(err);
  }
}

export async function deleteResume(req, res, next) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (String(resume.userId) !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await resume.deleteOne();
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    next(err);
  }
}

// Real live jobs from JSearch, RAG-ranked against this resume by the Python AI service.
// Response is trimmed to job_role, company_name, job_location, job_link only.
export async function findMatchingJobs(req, res, next) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (String(resume.userId) !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { location } = req.query;
    const jobs = await searchMatchingJobs({
      resumeText: resume.rawText,
      jobTitle: resume.jobTitle,
      location: location || '',
    });

    res.json(jobs);
  } catch (err) {
    next(err);
  }
}
