import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className="card job-card">
      <h3>{job.title}</h3>
      <p className="job-company">{job.company} · {job.location}{job.remote ? ' · Remote' : ''}</p>
      <div className="skill-tags">
        {job.skills?.slice(0, 5).map((s) => <span key={s} className="tag">{s}</span>)}
      </div>
      <Link to={`/jobs/${job._id}`} className="btn-secondary">View details</Link>
    </div>
  );
}
