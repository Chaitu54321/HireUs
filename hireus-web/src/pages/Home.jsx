import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import '../index.css';

const Home = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  // Load already-applied jobs for logged-in candidates
  useEffect(() => {
    if (user && user.role === 'CANDIDATE' && user.userId) {
      api.get(`/applications/candidate/${user.userId}`)
        .then(res => {
          const ids = new Set(res.data.map(a => a.jobId));
          setAppliedJobs(ids);
        })
        .catch(() => {});
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      setError('Could not load jobs. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchTerm.trim() || locationTerm.trim();
    if (!query) {
      fetchJobs();
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/jobs?search=${encodeURIComponent(query)}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to search jobs", err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!user || !user.userId) return;
    try {
      setApplyingId(jobId);
      await api.post('/applications', {
        jobId: jobId,
        candidateId: user.userId,
      });
      setAppliedJobs(prev => new Set([...prev, jobId]));
    } catch (err) {
      console.error("Failed to apply", err);
      alert("Failed to apply. You may have already applied to this job.");
    } finally {
      setApplyingId(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setLocationTerm('');
    fetchJobs();
  };

  return (
    <>
      {/* Hero */}
      <header className="hero" style={{ minHeight: '55vh' }}>
        <h1 className="hero-title">
          Find Your Next <span>Dream Role</span>
        </h1>
        <p className="hero-subtitle">
          The ultimate applicant tracking system bridging top talent with world-class opportunities.
        </p>

        <form className="search-container glass-panel" onSubmit={handleSearch}>
          <div className="search-input-group">
            <Search size={20} style={{ color: '#FDE047', flexShrink: 0 }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Job title or keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="search-input-group">
            <MapPin size={20} style={{ color: '#FDE047', flexShrink: 0 }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="City, state, or remote"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary search-btn">
            Find Jobs
          </button>
        </form>
      </header>

      {/* Job Listings */}
      <section className="features-section" style={{ paddingTop: '3rem' }}>
        <div className="section-head" style={{ marginBottom: '2rem' }}>
          <h2 className="section-title">
            {searchTerm || locationTerm ? 'Search Results' : 'Latest Opportunities'}
          </h2>
          <p className="text-secondary">
            {searchTerm || locationTerm 
              ? <><span>{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</span> &mdash; <button onClick={clearSearch} style={{ background: 'none', border: 'none', color: '#00c2ff', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit' }}>Clear search</button></>
              : 'Discover roles that match your skills'
            }
          </p>
        </div>
        
        {error && (
          <div style={{ textAlign: 'center', margin: '2rem auto', maxWidth: '600px', padding: '1rem', backgroundColor: 'rgba(255,77,79,0.1)', border: '1px solid rgba(255,77,79,0.3)', borderRadius: '12px', color: '#ff4d4f' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', margin: '3rem 0', color: '#aaa' }}>
            <div style={{ fontSize: '1.2rem' }}>Loading jobs...</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '850px', margin: '0 auto', paddingBottom: '4rem' }}>
            {jobs.length > 0 ? jobs.map(job => (
              <div key={job.id} className="feature-card glass-panel" style={{ textAlign: 'left', padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>{job.title}</h3>
                  {job.salary && (
                    <span style={{ color: '#FDE047', fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap' }}>
                      ${job.salary.toLocaleString()}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={15} /> {job.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={15} /> {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p style={{ color: '#b0b8c4', margin: '0 0 1.25rem 0', lineHeight: 1.6 }}>{job.description}</p>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {!user ? (
                    <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                      Login to Apply
                    </Link>
                  ) : user.role === 'RECRUITER' ? (
                    <span style={{ color: '#888', fontSize: '0.85rem', fontStyle: 'italic' }}>You are a recruiter</span>
                  ) : appliedJobs.has(job.id) ? (
                    <button disabled className="btn" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', backgroundColor: 'rgba(76,175,80,0.2)', color: '#4caf50', border: '1px solid #4caf50', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default' }}>
                      <CheckCircle size={16} /> Applied
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleApply(job.id)} 
                      disabled={applyingId === job.id}
                      className="btn btn-primary" 
                      style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      {applyingId === job.id ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p style={{ fontSize: '1.1rem' }}>No jobs posted yet.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Sign up as a Recruiter to post the first one!</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', padding: '2rem', 
        borderTop: '1px solid rgba(255,255,255,0.06)', 
        color: '#555', fontSize: '0.85rem' 
      }}>
        © {new Date().getFullYear()} HireUS &mdash; Built with React & Spring Boot
      </footer>
    </>
  );
};

export default Home;
