import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '', company: '', location: '', remote: false,
    salary: '', experience: '', skills: '', description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/jobs', {
        ...form,
        salary: form.salary ? Number(form.salary) : undefined,
        experience: form.experience ? Number(form.experience) : 0,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      navigate('/recruiter');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <form className="card auth-form" onSubmit={handleSubmit}>
        <h2>Post a Job</h2>
        {error && <p className="error-text">{error}</p>}
        <input name="title" placeholder="Job title" value={form.title} onChange={handleChange} required />
        <input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <label><input type="checkbox" name="remote" checked={form.remote} onChange={handleChange} /> Remote</label>
        <input name="salary" type="number" placeholder="Salary (annual)" value={form.salary} onChange={handleChange} />
        <input name="experience" type="number" placeholder="Years of experience required" value={form.experience} onChange={handleChange} />
        <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} />
        <textarea name="description" placeholder="Job description" rows={6} value={form.description} onChange={handleChange} required />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}
