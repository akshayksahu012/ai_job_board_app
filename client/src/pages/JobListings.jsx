import { useEffect, useState } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [remote, setRemote] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/jobs', { params: { search, remote, page, limit: 9 } });
        setJobs(data.jobs);
        setPages(data.pages);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [search, remote, page]);

  return (
    <div className="page">
      <h2>Job Listings</h2>
      <div className="filters-bar">
        <input
          placeholder="Search title, skills, description..."
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
        />
        <label>
          <input type="checkbox" checked={remote} onChange={(e) => { setPage(1); setRemote(e.target.checked); }} />
          Remote only
        </label>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid">
          {jobs.map((job) => <JobCard key={job._id} job={job} />)}
          {jobs.length === 0 && <p>No jobs match your filters.</p>}
        </div>
      )}

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page} of {pages || 1}</span>
        <button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
