import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setReports([]); // Clear previous state to prevent ghost data showing if API fails
      const endpoint = activeTab === 'pending' ? '/api/admin/reports/pending' : activeTab === 'active' ? '/api/reports/verified' : '/api/reports/solved';
      const res = await axios.get(endpoint);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/reports/${id}/status`, { status });
      fetchReports();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="mb-4" style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
      
      <div className="flex mb-4" style={{ gap: '15px' }}>
        <button 
          className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('pending')}
        >Pending Verification</button>
        <button 
          className={`btn ${activeTab === 'active' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('active')}
        >Active Cases</button>
        <button 
          className={`btn ${activeTab === 'solved' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('solved')}
        >Solved Cases</button>
      </div>

      {loading ? (
        <div>Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>No reports found in this category.</div>
      ) : (
        <div className="grid">
          {reports.map(report => (
            <div key={report.id} className="glass-panel case-card" style={{ padding: '20px' }}>
              <img 
                src={report.photo_url ? report.photo_url : 'https://placehold.co/400x300'} 
                alt={report.name} 
                className="mb-2" 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
              />
              <h3 className="mb-2">{report.name}</h3>
              <p className="mb-2" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <strong>Contact:</strong> {report.contact} <br/>
                <strong>Last Seen:</strong> {report.last_seen_date} at {report.last_seen_location} <br/>
                <strong>FIR Number:</strong> {report.fir_number || 'N/A'}
              </p>
              
              <div className="mb-4" style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <a href={report.aadhar_url ? report.aadhar_url : '#'} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-color)' }}>View Aadhar</a>
                <a href={report.fir_url ? report.fir_url : '#'} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-color)' }}>View FIR</a>
                <a href={report.selfie_url ? report.selfie_url : '#'} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-color)' }}>View Selfie Proof</a>
              </div>

              {activeTab === 'pending' ? (
                <div className="flex" style={{ gap: '10px' }}>
                  <button className="btn btn-success" style={{ flex: 1 }} onClick={() => handleUpdateStatus(report.id, 'verified')}>Verify Case</button>
                  <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleUpdateStatus(report.id, 'rejected')}>Reject Case</button>
                </div>
              ) : activeTab === 'active' ? (
                <div className="flex" style={{ gap: '10px' }}>
                  <button className="btn btn-success" style={{ flex: 1 }} onClick={() => handleUpdateStatus(report.id, 'found')}>Mark Found</button>
                  <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => handleUpdateStatus(report.id, 'closed')}>Close Case</button>
                </div>
              ) : (
                <div className="text-center" style={{ padding: '10px', border: '1px solid var(--success-color)', borderRadius: '8px', color: 'var(--success-color)' }}>
                  <b>Status:</b> {report.status.toUpperCase()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
