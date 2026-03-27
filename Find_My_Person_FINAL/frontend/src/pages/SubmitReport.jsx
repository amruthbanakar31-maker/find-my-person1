import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SubmitReport() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    last_seen_location: '',
    last_seen_date: '',
    contact: '',
    fir_number: ''
  });
  const [files, setFiles] = useState({
    photo: null,
    aadhar: null,
    fir: null,
    selfie: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    Object.keys(files).forEach(key => {
      if (files[key]) data.append(key, files[key]);
    });

    try {
      await axios.post('/api/reports', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Report submitted successfully! It is pending admin verification.');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="mb-2" style={{ fontSize: '2rem' }}>Report a Missing Person</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Please provide accurate details. Your submission will be verified by authorities before being published.
      </p>

      {error && <div className="glass-panel mb-4" style={{ padding: '15px', color: 'var(--danger-color)', border: '1px solid var(--danger-color)' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '30px' }}>
        <div className="form-group">
          <label className="form-label">Full Name of Missing Person</label>
          <input required type="text" name="name" className="form-input" onChange={handleInputChange} />
        </div>

        <div className="form-group grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label className="form-label">Last Seen Location</label>
            <input required type="text" name="last_seen_location" className="form-input" onChange={handleInputChange} />
          </div>
          <div>
            <label className="form-label">Date Last Seen</label>
            <input required type="date" name="last_seen_date" className="form-input" onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-group grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label className="form-label">Your Contact Number</label>
            <input required type="text" name="contact" className="form-input" onChange={handleInputChange} />
          </div>
          <div>
            <label className="form-label">Police FIR Number</label>
            <input required type="text" name="fir_number" className="form-input" onChange={handleInputChange} />
          </div>
        </div>

        <hr style={{ margin: '30px 0', borderColor: 'var(--border-color)' }} />
        <h3 className="mb-4" style={{ fontSize: '1.2rem' }}>Verification Documents</h3>

        <div className="form-group">
          <label className="form-label">Missing Person's Recent Photo (Required)</label>
          <input type="file" accept="image/*" name="photo" className="form-input" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Your Aadhar Card (Required for Verification)</label>
          <input type="file" accept="image/*,.pdf" name="aadhar" className="form-input" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Copy of FIR (Required)</label>
          <input type="file" accept="image/*,.pdf" name="fir" className="form-input" onChange={handleFileChange} />
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Your Selfie with Aadhar (For Identity Proof)</label>
          <input type="file" accept="image/*" name="selfie" className="form-input" onChange={handleFileChange} />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }} disabled={submitting}>
          {submitting ? 'Submitting Report...' : 'Submit Report for Verification'}
        </button>
      </form>
    </div>
  );
}
