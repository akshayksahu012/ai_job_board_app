import Job from '../models/Job.js';

export async function createJob(req, res, next) {
  try {
    const { title, company, location, remote, salary, experience, skills, description } = req.body;
    if (!title || !company || !description) {
      return res.status(400).json({ message: 'Title, company and description are required' });
    }

    const job = await Job.create({
      title,
      company,
      location,
      remote: !!remote,
      salary,
      experience,
      skills: skills || [],
      description,
      createdBy: req.user.id,
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
}

export async function getJobs(req, res, next) {
  try {
    const { search, location, remote, minSalary, skills, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (search) filter.$text = { $search: search };
    if (location) filter.location = new RegExp(location, 'i');
    if (remote === 'true') filter.remote = true;
    if (minSalary) filter.salary = { $gte: Number(minSalary) };
    if (skills) filter.skills = { $in: skills.split(',') };

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Job.countDocuments(filter);
    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

export async function getJobById(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

export async function updateJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.createdBy) !== req.user.id) {
      return res.status(403).json({ message: 'Not your job posting' });
    }

    const fields = ['title', 'company', 'location', 'remote', 'salary', 'experience', 'skills', 'description'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) job[f] = req.body[f];
    });

    await job.save();
    res.json(job);
  } catch (err) {
    next(err);
  }
}

export async function deleteJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.createdBy) !== req.user.id) {
      return res.status(403).json({ message: 'Not your job posting' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
}
