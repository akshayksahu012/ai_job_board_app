import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="hero">
      <h1>Find jobs AI actually understands</h1>
      <p>Upload your resume and get real, live job postings ranked by how well you actually match.</p>
      <div className="hero-actions">
        <Link to="/jobs" className="btn-primary">Browse Posted Jobs</Link>
        <Link to="/register" className="btn-secondary">Get Started</Link>
      </div>
    </div>
  );
}
