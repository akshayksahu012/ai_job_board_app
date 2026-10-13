import { useEffect, useState } from 'react';
import api from '../services/api';
import MatchedJobCard from '../components/MatchedJobCard';
import JobCard from '../components/JobCard';
import './CandidateDashboard.css';

export default function CandidateDashboard() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [location, setLocation] = useState('');
  const [matches, setMatches] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchMsg, setSearchMsg] = useState('');

  // Recruiter-posted jobs (plain listing from our own DB, shown alongside AI matches)
  const [postedJobs, setPostedJobs] = useState([]);

  const loadResumes = () =>
    api.get('/resume').then((res) => {
      setResumes(res.data);
      if (res.data[0] && !selectedResume) setSelectedResume(res.data[0]._id);
    });

  useEffect(() => {
    loadResumes();
    api.get('/jobs', { params: { limit: 6 } }).then((res) => setPostedJobs(res.data.jobs));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadMsg('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMsg('Resume uploaded and analyzed.');
      setFile(null);
      setSelectedResume(data._id);
      loadResumes();
    } catch (err) {
      setUploadMsg(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const findMatches = async () => {
    if (!selectedResume) return;
    setSearching(true);
    setSearchMsg('');
    setMatches([]);
    try {
      const { data } = await api.get(`/resume/${selectedResume}/matches`, { params: { location } });
      setMatches(data);
      if (data.length === 0) setSearchMsg('No live postings found for this resume right now.');
    } catch (err) {
      setSearchMsg(err.response?.data?.message || 'Job search failed');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="page">
      <h2>Candidate Dashboard</h2>

      <div className="card">
        <h3>Upload Resume</h3>
        <form onSubmit={handleUpload} className="upload-form">
          <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading ? 'Analyzing...' : 'Upload'}
          </button>
        </form>
        {uploadMsg && <p>{uploadMsg}</p>}
      </div>

      <div className="card">
        <h3>Find Matching Jobs</h3>
        {resumes.length === 0 ? (
          <p className="empty-state">Upload a resume above first.</p>
        ) : (
          <>
            <div className="filters-bar">
              <select value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)}>
                {resumes.map((r) => <option key={r._id} value={r._id}>{r.fileName}</option>)}
              </select>
              <input
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button className="btn-primary" onClick={findMatches} disabled={searching}>
                {searching ? 'Searching live jobs...' : 'Find Matching Jobs'}
              </button>
            </div>
            {searchMsg && <p>{searchMsg}</p>}
          </>
        )}
      </div>

      {matches.length > 0 && (
        <>
          <h3>AI-Matched Jobs</h3>
          <div className="grid">
            {matches.map((job, i) => <MatchedJobCard key={i} job={job} />)}
          </div>
        </>
      )}

      <h3>Recently Posted by Recruiters</h3>
      <div className="grid">
        {postedJobs.map((job) => <JobCard key={job._id} job={job} />)}
        {postedJobs.length === 0 && <p className="empty-state">No jobs posted yet.</p>}
      </div>
    </div>
  );
}
