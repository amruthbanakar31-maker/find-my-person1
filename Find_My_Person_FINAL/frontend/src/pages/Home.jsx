import { useState, useEffect } from 'react';
import axios from 'axios';
import CaseCard from '../components/CaseCard';
import { Upload, Shield, Share2, Bell } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

const Home = () => {
    const [reports, setReports] = useState([]);
    const [solvedReports, setSolvedReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
          const fetchReports = async () => {
                  try {
                            setLoading(true);
                            const [resActive, resSolved] = await Promise.all([
                                        axios.get(`${API_URL}/api/reports/verified`),
                                        axios.get(`${API_URL}/api/reports/solved`)
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
                <div className="mb-4 text-center mt-4 pt-4">
                        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>How It Works</h1>h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>A simple 4-step process to amplify your search for a missing person</p>p>
                </div>div>
                <div className="grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px', marginBottom: '80px', marginTop: '40px' }}>
                  {[
            { step: 1, title: 'Upload Details', desc: 'Submit essential information.', icon: <Upload size={32} color="var(--accent-color)" /> },
            { step: 2, title: 'FIR Verification', desc: 'Verify authenticity.', icon: <Shield size={32} color="var(--accent-color)" /> },
            { step: 3, title: 'Sharing', desc: 'Maximize reach.', icon: <Share2 size={32} color="var(--accent-color)" /> },
            { step: 4, title: 'Updates', desc: 'Track alerts.', icon: <Bell size={32} color="var(--accent-color)" /> }
                    ].map(item => (
                                <div key={item.step} className="glass-panel text-center" style={{ padding: '30px 20px', position: 'relative' }}>
                                            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-color)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{item.step}</div>div>
                                            <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>div>
                                            <h3 style={{ marginBottom: '15px' }}>{item.title}</h3>h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.desc}</p>p>
                                </div>div>
                              ))}
                </div>div>
                <div className="mb-4">
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Active Alerts</h2>h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Help us bring them home.</p>p>
                </div>div>
            {loading ? (
                    <div className="text-center mt-4">Loading cases...</div>
                  ) : reports.length === 0 ? (
                    <div className="glass-panel mb-4" style={{ padding: '40px', textAlign: 'center' }}>
                              <h3 style={{ color: 'var(--text-secondary)' }}>No active verified alerts.</h3>
                    </div>
                  ) : (
                    <div className="grid">
                      {reports.map(report => (
                                  <CaseCard key={report.id} data={report} />
                                ))}
                    </div>
                )}
            {!loading && solvedReports.length > 0 && (
                    <div className="mt-4 pt-4 animate-fade-in mb-4">
                              <hr style={{ margin: '40px 0', borderColor: 'var(--border-color)' }}/>
                              <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Solved Cases</h2>
                              <div className="grid mt-4">
                                {solvedReports.map(report => (
                                    <CaseCard key={report.id} data={report} />
                                  ))}
                              </div>
                    </div>
                )}
          </div>
        );
};
export default Home;
