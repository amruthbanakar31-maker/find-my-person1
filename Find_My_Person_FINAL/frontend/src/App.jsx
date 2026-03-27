import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitReport from './pages/SubmitReport';
import AdminDashboard from './pages/AdminDashboard';
import CaseDetails from './pages/CaseDetails';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="page-wrapper container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<SubmitReport />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/case/:id" element={<CaseDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
