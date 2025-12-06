import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboardPage from './pages/FarmerDashboardPage';
import BuyerMarketplacePage from './pages/BuyerMarketplacePage';
import AdminVerificationPage from './pages/AdminVerificationPage';
import TransactionsPage from './pages/TransactionsPage';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/farmer" element={<FarmerDashboardPage />} />
          <Route path="/market" element={<BuyerMarketplacePage />} />
          <Route path="/admin/verification" element={<AdminVerificationPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
