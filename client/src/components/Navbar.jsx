import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex gap-4 text-sm text-slate-300">
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/farmer">Farmer Dashboard</Link>
      <Link to="/market">Marketplace</Link>
      <Link to="/admin/verification">Admin Verification</Link>
      <Link to="/transactions">Transactions</Link>
    </nav>
  );
}

export default Navbar;
