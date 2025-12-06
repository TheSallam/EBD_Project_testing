import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-title">AgriFlow</div>
      <Link className="nav-link" to="/">Home</Link>
      <Link className="nav-link" to="/login">Login</Link>
      <Link className="nav-link" to="/register">Register</Link>
      <Link className="nav-link" to="/farmer">Farmer Dashboard</Link>
      <Link className="nav-link" to="/market">Marketplace</Link>
      <Link className="nav-link" to="/admin/verification">Admin Verification</Link>
      <Link className="nav-link" to="/transactions">Transactions</Link>
    </nav>
  );
}

export default Navbar;
