import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Share2, Phone } from 'lucide-react';

export default function CaseDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sighting form
  const [sightingData, setSightingData] = useState({ location: '', date: '', details: '' });
  const [sightingImg, setSightingImg] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/reports/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleSightingSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('report_id', id);
    formData.append('location', sightingData.location);
    formData.append('date', sightingData.date);
    formData.append('details', sightingData.details);
    if (sightingImg) formData.append('photo', sightingImg);

    try {
      await axios.post('/api/sightings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Sighting reported successfully! Authorities will review.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to report sighting');
    }
  };

  const handleShare = () => {
    const text = `URGENT: Missing Person Alert for ${data.report.name}. Last seen at ${data.report.last_seen_location}. Please help find them!`;
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="text-center mt-4">Loading details...</div>;
  if (!data || !data.report) return <div className="text-center mt-4">Case not found</div>;

  const { report, sightings } = data;

  return (
    <div className="animate-fade-in grid" style={{ gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '40px', alignItems: 'start' }}>
      
      {/* Left Column: Details & Feed */}
      <div>
        <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
          <img 
            src={report.photo_url ? report.photo_url : 'https://placehold.co/600x400'} 
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }} 
            alt={report.name} 
          />
          <div className="flex justify-between items-center mb-4">
            <h1 style={{ fontSize: '2.5rem' }}>{report.name}</h1>
            <span className={`status-badge ${report.status === 'found' ? 'status-found' : 'status-verified'}`} style={{ position: 'static' }}>
              {report.status.toUpperCase()}
            </span>
          </div>

          <p className="mb-4" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Please contact the family or authorities immediately if you have any information.
          </p>

          <div className="grid mb-4" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="flex items-center">
              <MapPin size={20} style={{ marginRight: '10px', color: 'var(--accent-color)' }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last Seen Location</span>
                <strong>{report.last_seen_location}</strong>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar size={20} style={{ marginRight: '10px', color: 'var(--accent-color)' }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Date Last Seen</span>
                <strong>{report.last_seen_date}</strong>
              </div>
            </div>
            <div className="flex items-center">
              <Phone size={20} style={{ marginRight: '10px', color: 'var(--accent-color)' }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Contact for Information</span>
                <strong>{report.contact}</strong>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }} onClick={handleShare}>
            <Share2 size={18} /> Disseminate Information to Social Networks
          </button>
        </div>

        {/* Sightings Feed */}
        <h3 className="mb-4">Reported Sightings ({sightings.length})</h3>
        {sightings.length === 0 && <p style={{color: 'var(--text-secondary)'}}>No sightings reported yet.</p>}
        {sightings.map(s => (
          <div key={s.id} className="glass-panel mb-4 animate-fade-in" style={{ padding: '20px', borderLeft: '4px solid var(--accent-color)' }}>
            <div className="flex justify-between mb-2" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px'}}/> {s.location}</span>
              <span>{s.date}</span>
            </div>
            <p className="mb-2">{s.details}</p>
            {s.photo_url && <img src={s.photo_url} style={{ width: '100%', maxWidth: '200px', borderRadius: '8px', marginTop: '10px' }} alt="Sighting Attachment" />}
          </div>
        ))}
      </div>

      {/* Right Column: Sighting Form */}
      <div className="glass-panel" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
        <h3 className="mb-4 text-center">Report a Sighting</h3>
        <form onSubmit={handleSightingSubmit}>
          <div className="form-group">
            <label className="form-label">Sighting Location</label>
            <input required type="text" className="form-input" placeholder="E.g. Main Street Station" value={sightingData.location} onChange={e => setSightingData({...sightingData, location: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Sighting</label>
            <input required type="date" className="form-input" value={sightingData.date} onChange={e => setSightingData({...sightingData, date: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Additional Details</label>
            <textarea required className="form-input" rows="4" placeholder="What were they wearing? Did they seem okay?" value={sightingData.details} onChange={e => setSightingData({...sightingData, details: e.target.value})}></textarea>
          </div>
          <div className="form-group mb-4">
            <label className="form-label">Attach Photo (Optional)</label>
            <input type="file" accept="image/*" className="form-input" onChange={e => setSightingImg(e.target.files[0])} />
          </div>
          <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '12px' }}>Submit Sighting Report</button>
        </form>
      </div>

    </div>
  );
}
