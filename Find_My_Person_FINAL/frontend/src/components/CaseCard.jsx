import { Link } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';

export default function CaseCard({ data }) {
  const statusLabel = data.status === 'found' ? 'Found Safe' : 'Missing';
  const statusClass = data.status === 'found' ? 'status-found' : 'status-verified';

  return (
    <div className="glass-panel case-card animate-fade-in">
      <div className="card-img-wrapper">
        <img 
          src={data.photo_url ? data.photo_url : 'https://placehold.co/400x300?text=No+Photo'} 
          alt={data.name} 
          className="card-img" 
        />
        <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
      </div>
      <div className="card-content">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{data.name}</h3>
        <div className="flex items-center mb-2" style={{ color: 'var(--text-secondary)' }}>
          <MapPin size={16} style={{ marginRight: '8px', color: 'var(--accent-color)' }} />
          <span style={{ fontSize: '0.9rem' }}>{data.last_seen_location}</span>
        </div>
        <div className="flex items-center mb-4" style={{ color: 'var(--text-secondary)' }}>
          <Calendar size={16} style={{ marginRight: '8px', color: 'var(--accent-color)' }} />
          <span style={{ fontSize: '0.9rem' }}>{data.last_seen_date}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Link to={`/case/${data.id}`} className="btn btn-primary" style={{ width: '100%' }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
