import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="/dashboard" element={
          <ProtectedRoute roles={['candidate']}><CandidateDashboard /></ProtectedRoute>
        } />

        <Route path="/recruiter" element={
          <ProtectedRoute roles={['recruiter', 'admin']}><RecruiterDashboard /></ProtectedRoute>
        } />
        <Route path="/recruiter/post" element={
          <ProtectedRoute roles={['recruiter', 'admin']}><PostJob /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}
