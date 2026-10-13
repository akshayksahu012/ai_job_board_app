import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './RecruiterDashboard.css';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/jobs', { params: { limit: 50 } }).then((res) => {
      setJobs(res.data.jobs.filter((j) => j.createdBy === user.id));
    });
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    await api.delete(`/jobs/${id}`);
    setJobs(jobs.filter((j) => j._id !== id));
  };

  return (
    <div className="page">
      <div className="job-card-header">
        <h2>Recruiter Dashboard</h2>
        <Link to="/recruiter/post" className="btn-primary">+ Post a Job</Link>
      </div>

      <div className="grid">
        {jobs.map((job) => (
          <div key={job._id} className="card job-card">
            <h3>{job.title}</h3>
            <p className="job-company">{job.company} · {job.location}</p>
            <div className="job-card-actions">
              <button className="btn-danger" onClick={() => handleDelete(job._id)}>Delete</button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="empty-state">You haven't posted any jobs yet.</p>}
      </div>
    </div>
  );
}
