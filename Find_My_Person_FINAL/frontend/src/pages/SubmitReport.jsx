import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';

const SubmitReport = () => {
    const [formData, setFormData] = useState({ name: '', last_seen_location: '', last_seen_date: '', contact: '', fir_number: '' });
    const [files, setFiles] = useState({ photo: null, aadhar: null, fir: null, selfie: null });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          const data = new FormData();
          Object.keys(formData).forEach(key => data.append(key, formData[key]));
          Object.keys(files).forEach(key => { if(files[key]) data.append(key, files[key]); });

          try {
                  await axios.post(`${API_URL}/api/reports`, data);
                  alert('Report submitted successfully! Waiting for admin verification.');
                  navigate('/');
          } catch (err) {
                  console.error(err);
                  alert('Failed to submit report');
          } finally {
                  setLoading(false);
          }
    };

    return (
          <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
                  <h1>Submit Missing Person Report</h1>
                <form onSubmit={handleSubmit} className="grid" style={{ gap: '20px' }}>
                        <input type="text" name="name" placeholder="Missing Person Name" required onChange={handleChange} />
                        <input type="text" name="last_seen_location" placeholder="Last Seen Location" required onChange={handleChange} />
                        <input type="date" name="last_seen_date" required onChange={handleChange} />
                        <input type="text" name="contact" placeholder="Contact Phone Number" required onChange={handleChange} />
                        <input type="text" name="fir_number" placeholder="FIR Number" required onChange={handleChange} />
                        <div>
                                   <label>Photo of Missing Person:</label>label>
                                   <input type="file" name="photo" required onChange={handleFileChange} />
                        </div>div>
                        <div>
                                   <label>Aadhar Card Proof:</label>label>
                                   <input type="file" name="aadhar" required onChange={handleFileChange} />
                        </div>div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</button>
                </f
          </div>div>
        );
};
export default SubmitReport;
</h1>
