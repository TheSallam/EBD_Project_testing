import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FarmerDashboardPage from "./pages/FarmerDashboardPage";
import BuyerMarketplacePage from "./pages/BuyerMarketplacePage";
import AdminVerificationPage from "./pages/AdminVerificationPage";
import TransactionsPage from "./pages/TransactionsPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="text-lg font-semibold tracking-tight">AgriFlow</div>
          <Navbar />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/farmer" element={<FarmerDashboardPage />} />
          <Route path="/market" element={<BuyerMarketplacePage />} />
          <Route path="/admin/verification" element={<AdminVerificationPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
