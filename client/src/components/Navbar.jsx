import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">AI Job Board</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/#about">About</Link>
        <Link to="/#category">Category</Link>
        <Link to="/#blog">Blog</Link>
        <Link to="/#contact">Contact</Link>
        {!user && <Link className="nav-login" to="/login">Login</Link>}

        {user?.role === 'candidate' && <Link to="/dashboard">Dashboard</Link>}
        {user?.role === 'recruiter' && <Link to="/recruiter">Recruiter</Link>}

        {user && (
          <>
            <span className="user-name">Hi, {user.name}</span>
            <button className="btn-link" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
