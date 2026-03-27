import { useState, useEffect } from 'react';
import axios from 'axios';
import CaseCard from '../components/CaseCard';
import { Upload, Shield, Share2, Bell } from 'lucide-react';

export default function Home() {
  const [reports, setReports] = useState([]);
  const [solvedReports, setSolvedReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [resActive, resSolved] = await Promise.all([
          axios.get('/api/reports/verified'),
          axios.get('/api/reports/solved')
        ]);
        setReports(resActive.data);
        setSolvedReports(resSolved.data);
      } catch (err) {
        console.error("Error fetching reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="animate-fade-in">
      
      {/* How It Works Section */}
      <div className="mb-4 text-center mt-4 pt-4">
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>How It Works</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>A simple 4-step process to amplify your search for a missing person</p>
      </div>

      <div className="grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px', marginBottom: '80px', marginTop: '40px' }}>
        {[
          { step: 1, title: 'Upload Details', desc: 'Submit a clear photo of the missing person along with essential information like name, age, and last known location.', icon: <Upload size={32} color="var(--accent-color)" /> },
          { step: 2, title: 'FIR Verification', desc: 'Upload your registered FIR copy. Our system verifies the document to ensure authenticity and prevent misuse.', icon: <Shield size={32} color="var(--accent-color)" /> },
          { step: 3, title: 'Social Media Sharing', desc: 'Once verified, share the report across social networks to maximize reach and visibility.', icon: <Share2 size={32} color="var(--accent-color)" /> },
          { step: 4, title: 'Real-time Updates', desc: 'Track the reach of your alert and receive notifications when people report sightings or provide information.', icon: <Bell size={32} color="var(--accent-color)" /> }
        ].map(item => (
          <div key={item.step} className="glass-panel text-center" style={{ padding: '30px 20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-color)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{item.step}</div>
            <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
            <h3 style={{ marginBottom: '15px' }}>{item.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel text-center mb-4" style={{ padding: '40px 20px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(220, 39, 67, 0.3)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Join the Community</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 20px' }}>Follow our official Instagram page to help amplify missing person alerts across your network.</p>
        <a href="https://www.instagram.com/bring_me__back_?igsh=ZjNjaWZ6MmlkZmRt" target="_blank" rel="noreferrer" className="btn" style={{ background: 'white', color: '#dc2743', fontWeight: 'bold', padding: '12px 24px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center' }}>
          📸 <span style={{ marginLeft: '8px' }}>Follow @bring_me__back_</span>
        </a>
      </div>

      <hr style={{ margin: '40px 0', borderColor: 'var(--border-color)' }}/>

      {/* Active Alerts */}
      <div className="mb-4">
        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Active Alerts</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Help us bring them home. Report any sightings immediately.</p>
      </div>

      {loading ? (
        <div className="text-center mt-4">Loading cases...</div>
      ) : reports.length === 0 ? (
        <div className="glass-panel mb-4" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>No active verified alerts at the moment.</h3>
        </div>
      ) : (
        <div className="grid">
          {reports.map(report => (
            <CaseCard key={report.id} data={report} />
          ))}
        </div>
      )}

      {/* Solved Cases */}
      {!loading && solvedReports.length > 0 && (
        <div className="mt-4 pt-4 animate-fade-in mb-4">
          <hr style={{ margin: '40px 0', borderColor: 'var(--border-color)' }}/>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Solved Cases</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Successfully located individuals.</p>
          <div className="grid mt-4">
            {solvedReports.map(report => (
              <CaseCard key={report.id} data={report} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
