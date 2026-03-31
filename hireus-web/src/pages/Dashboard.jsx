import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock, User, Mail, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import api from '../api';

const inputStyle = {
  width: '100%', padding: '0.75rem', borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.15)', backgroundColor: '#1a1a2e',
  color: '#fff', fontSize: '0.95rem', outline: 'none',
};

const statusColors = {
  APPLIED: { bg: 'rgba(96,165,250,0.15)', text: '#60a5fa', border: '#60a5fa' },
  INTERVIEW: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24', border: '#fbbf24' },
  ACCEPTED: { bg: 'rgba(74,222,128,0.15)', text: '#4ade80', border: '#4ade80' },
  REJECTED: { bg: 'rgba(248,113,113,0.15)', text: '#f87171', border: '#f87171' },
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [jobForm, setJobForm] = useState({ title: '', description: '', location: '', salary: '' });

  // Recruiter state
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Candidate state
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  // Load data on mount
  useEffect(() => {
    if (user.role === 'RECRUITER') {
      loadMyJobs();
    } else {
      loadMyApplications();
    }
  }, [user]);

  const loadMyJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setMyJobs(res.data);
    } catch (err) {
      console.error('Failed to load jobs', err);
    }
  };

  const loadMyApplications = async () => {
    if (!user.userId) return;
    try {
      setLoadingApps(true);
      const res = await api.get(`/applications/candidate/${user.userId}`);
      setMyApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const viewApplicants = async (job) => {
    setSelectedJob(job);
    setLoadingApplicants(true);
    try {
      const res = await api.get(`/applications/job/${job.id}`);
      setApplicants(res.data);
    } catch (err) {
      console.error('Failed to load applicants', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status?status=${newStatus}`);
      // Refresh applicants
      if (selectedJob) viewApplicants(selectedJob);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/jobs', {
        title: jobForm.title,
        description: jobForm.description,
        location: jobForm.location,
        salary: parseFloat(jobForm.salary) || 0,
      });
      setSuccess('Job posted successfully!');
      setJobForm({ title: '', description: '', location: '', salary: '' });
      setShowForm(false);
      loadMyJobs();
    } catch (err) {
      setError(err.response?.data || 'Failed to post job.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      {/* Header Card */}
      <div className="feature-card glass-panel" style={{ padding: '2rem', textAlign: 'left', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Welcome, {user.username}!</h2>
        <p style={{ color: '#aaa' }}>
          Role: <span style={{ color: '#FDE047', fontWeight: 'bold' }}>{user.role}</span>
        </p>
      </div>

      {success && <div style={{ color: '#4caf50', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(76,175,80,0.1)', borderRadius: '8px', border: '1px solid rgba(76,175,80,0.3)' }}>{success}</div>}
      {error && <div style={{ color: '#ff4d4f', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255,77,79,0.1)', borderRadius: '8px', border: '1px solid rgba(255,77,79,0.3)' }}>{error}</div>}

      {user.role === 'RECRUITER' ? (
        <>
          {/* Post Job Section */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>Your Job Listings</h3>
              <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
                {showForm ? 'Cancel' : '+ Post a New Job'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handlePostJob} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ color: '#bbb', display: 'block', marginBottom: '0.4rem' }}>Job Title *</label>
                  <input type="text" value={jobForm.title} onChange={(e) => setJobForm({...jobForm, title: e.target.value})} style={inputStyle} placeholder="e.g. Senior React Developer" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ color: '#bbb', display: 'block', marginBottom: '0.4rem' }}>Location *</label>
                    <input type="text" value={jobForm.location} onChange={(e) => setJobForm({...jobForm, location: e.target.value})} style={inputStyle} placeholder="e.g. Remote" required />
                  </div>
                  <div>
                    <label style={{ color: '#bbb', display: 'block', marginBottom: '0.4rem' }}>Salary (USD)</label>
                    <input type="number" value={jobForm.salary} onChange={(e) => setJobForm({...jobForm, salary: e.target.value})} style={inputStyle} placeholder="e.g. 120000" />
                  </div>
                </div>
                <div>
                  <label style={{ color: '#bbb', display: 'block', marginBottom: '0.4rem' }}>Description *</label>
                  <textarea value={jobForm.description} onChange={(e) => setJobForm({...jobForm, description: e.target.value})} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Describe the role..." required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Publish Job</button>
              </form>
            )}
          </div>

          {/* Jobs List */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {myJobs.length > 0 ? myJobs.map(job => (
              <div key={job.id} className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', cursor: 'pointer', border: selectedJob?.id === job.id ? '1px solid #FDE047' : '1px solid rgba(255,255,255,0.08)' }} onClick={() => viewApplicants(job)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: '#fff', margin: '0 0 0.25rem 0' }}>{job.title}</h4>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {job.location}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {job.salary && <div style={{ color: '#FDE047', fontWeight: 600 }}>${job.salary.toLocaleString()}</div>}
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>Click to view applicants</div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '12px', color: '#888' }}>
                No jobs posted yet. Click "Post a New Job" to get started!
              </div>
            )}
          </div>

          {/* Applicants Panel */}
          {selectedJob && (
            <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ color: '#fff', marginBottom: '1rem' }}>
                Applicants for: <span style={{ color: '#FDE047' }}>{selectedJob.title}</span>
              </h3>

              {loadingApplicants ? (
                <p style={{ color: '#aaa' }}>Loading applicants...</p>
              ) : applicants.length > 0 ? (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {applicants.map(app => {
                    const sc = statusColors[app.status] || statusColors.APPLIED;
                    return (
                      <div key={app.id} style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontWeight: 600, marginBottom: '0.3rem' }}>
                              <User size={16} /> {app.candidateUsername || 'Unknown'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>
                              <Mail size={14} /> {app.candidateEmail || 'N/A'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                              <Clock size={14} /> Applied: {new Date(app.appliedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                              {app.status}
                            </span>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button onClick={(e) => { e.stopPropagation(); updateApplicationStatus(app.id, 'INTERVIEW'); }} title="Move to Interview" style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #fbbf24', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', cursor: 'pointer', fontSize: '0.75rem' }}>
                                <MessageCircle size={12} /> Interview
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); updateApplicationStatus(app.id, 'ACCEPTED'); }} title="Accept" style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #4ade80', background: 'rgba(74,222,128,0.1)', color: '#4ade80', cursor: 'pointer', fontSize: '0.75rem' }}>
                                <CheckCircle size={12} /> Accept
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); updateApplicationStatus(app.id, 'REJECTED'); }} title="Reject" style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #f87171', background: 'rgba(248,113,113,0.1)', color: '#f87171', cursor: 'pointer', fontSize: '0.75rem' }}>
                                <XCircle size={12} /> Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: '#888', fontStyle: 'italic' }}>No one has applied to this job yet.</p>
              )}
            </div>
          )}
        </>
      ) : (
        /* CANDIDATE DASHBOARD */
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Your Applications</h3>
          
          {loadingApps ? (
            <p style={{ color: '#aaa' }}>Loading your applications...</p>
          ) : myApplications.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {myApplications.map(app => {
                const sc = statusColors[app.status] || statusColors.APPLIED;
                return (
                  <div key={app.id} style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h4 style={{ color: '#fff', margin: '0 0 0.3rem 0' }}>{app.jobTitle || 'Job #' + app.jobId}</h4>
                        <div style={{ display: 'flex', gap: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                          {app.jobLocation && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {app.jobLocation}</span>}
                          {app.jobSalary && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={14} /> ${app.jobSalary.toLocaleString()}</span>}
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span style={{ padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
              <Briefcase size={40} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
              <p>You haven't applied to any jobs yet.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Browse the <a href="/" style={{ color: '#00c2ff' }}>home page</a> to find opportunities!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
