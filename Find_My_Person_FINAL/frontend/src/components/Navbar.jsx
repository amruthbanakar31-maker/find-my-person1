import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar scrolled">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          <Search size={28} color="#3b82f6" />
          Find My Person
        </Link>
        <div className="nav-links">
          <Link to="/" className="btn">Feed</Link>
          <Link to="/submit" className="btn btn-primary">Report Missing</Link>
          <Link to="/admin" className="btn btn-outline" style={{marginLeft: '10px'}}>Admin Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
