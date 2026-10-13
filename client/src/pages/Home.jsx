import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Home.css';

const categories = ['Technology', 'Design', 'Marketing', 'Business'];

export default function Home() {
  const location = useLocation();
  const heroRef = useRef(null);

  const moveHeroImage = (event) => {
    if (event.pointerType !== 'mouse' || !heroRef.current) return;

    const bounds = heroRef.current.getBoundingClientRect();
    const moveX = ((event.clientX - bounds.left) / bounds.width - 0.5) * -16;
    const moveY = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
    heroRef.current.style.setProperty('--move-x', `${moveX}px`);
    heroRef.current.style.setProperty('--move-y', `${moveY}px`);
  };

  const resetHeroImage = () => {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty('--move-x', '0px');
    heroRef.current.style.setProperty('--move-y', '0px');
  };

  useEffect(() => {
    const sectionName = location.hash.slice(1);
    if (!sectionName) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const timer = window.setTimeout(() => {
      document.getElementById(sectionName)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <main className="home-page">
      <section className="hero" id="home" ref={heroRef} onPointerMove={moveHeroImage} onPointerLeave={resetHeroImage}>
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-content">
          <span className="hero-label">A brighter way to find work</span>
          <h1>Find a role that fits <span>your next big idea.</span></h1>
          <p>Explore thoughtful opportunities and let AI help connect your skills with the right job.</p>
          <div className="hero-actions">
            <Link to="/jobs" className="btn-primary">Browse jobs</Link>
            <Link to="/register" className="btn-secondary">Get started</Link>
          </div>
          <div className="hero-note">Simple search · Better matches · New opportunities</div>
        </div>
      </section>

      <section className="home-section about-section" id="about">
        <div className="section-copy">
          <span className="eyebrow">About us</span>
          <h2>Your next step, made simpler.</h2>
          <p>AI Job Board brings job seekers and growing teams together. Add your resume, discover relevant roles, and spend more time on opportunities that feel right.</p>
        </div>
        <div className="about-card"><span>✿</span><strong>Good work starts with a good match.</strong><small>Find jobs that fit your skills and goals.</small></div>
      </section>

      <section className="home-section category-section" id="category">
        <div className="section-heading">
          <div><span className="eyebrow">Explore by interest</span><h2>Find your kind of work</h2></div>
          <Link to="/jobs" className="text-link">See all jobs →</Link>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link to="/jobs" className={`category-card category-${index + 1}`} key={category}>
              <span>{['⌘', '✎', '◌', '⌂'][index]}</span><strong>{category}</strong><small>Explore open roles →</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section blog-section" id="blog">
        <span className="eyebrow">From the blog</span>
        <h2>A little help for your next move</h2>
        <div className="blog-grid">
          <article className="blog-card"><span>CAREER TIPS</span><h3>Make your resume easy to read</h3><p>Small changes can help your best skills stand out.</p></article>
          <article className="blog-card"><span>JOB SEARCH</span><h3>Find a role that fits your goals</h3><p>A clear search starts with knowing what matters to you.</p></article>
          <article className="blog-card"><span>FOR TEAMS</span><h3>Build a welcoming job post</h3><p>Help the right people picture themselves on your team.</p></article>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-intro">
          <span className="eyebrow">Contact</span>
          <h2>We’re here to help.</h2>
          <p>Whether you’re looking for work or hiring a great team, start with one of these links.</p>
        </div>
        <div className="contact-options">
          <Link to="/jobs"><span>01</span><strong>Looking for a job?</strong><small>Browse current opportunities →</small></Link>
          <Link to="/register"><span>02</span><strong>Hiring for your team?</strong><small>Create an account to get started →</small></Link>
          <Link to="/login"><span>03</span><strong>Need account help?</strong><small>Sign in to access your account →</small></Link>
        </div>
      </section>
    </main>
  );
}
