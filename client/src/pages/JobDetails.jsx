import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './JobDetails.css';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data));
  }, [id]);

  if (!job) return <p className="page">Loading...</p>;

  return (
    <div className="page">
      <div className="card">
        <h2>{job.title}</h2>
        <p className="job-company">{job.company} · {job.location}{job.remote ? ' · Remote' : ''}</p>
        {job.salary && <p><span className="badge">Salary: ${job.salary.toLocaleString()}</span></p>}
        <div className="skill-tags">
          {job.skills.map((s) => <span key={s} className="tag">{s}</span>)}
        </div>
        <p className="job-description">{job.description}</p>
      </div>
    </div>
  );
}
