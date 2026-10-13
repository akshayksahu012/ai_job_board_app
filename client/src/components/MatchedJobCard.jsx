import './MatchedJobCard.css';

export default function MatchedJobCard({ job }) {
  return (
    <div className="card job-card matched-card">
      <span className="matched-badge">AI Match</span>
      <h3>{job.job_role}</h3>
      <p className="job-company">{job.company_name} · {job.job_location}</p>
      <a href={job.job_link} target="_blank" rel="noreferrer" className="btn-primary">Apply</a>
    </div>
  );
}