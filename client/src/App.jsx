import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FarmerDashboardPage from "./pages/FarmerDashboardPage";
import BuyerMarketplacePage from "./pages/BuyerMarketplacePage";
import AdminVerificationPage from "./pages/AdminVerificationPage";
import TransactionsPage from "./pages/TransactionsPage";
import { useAuthUser, isLoggedIn } from "./lib/auth";

function App() {
  const user = useAuthUser();

  const RequireAuth = ({ children, role }) => {
    if (!isLoggedIn()) return <Navigate to="/login" replace />;
    if (role && user?.role !== role) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <div className="min-h-screen text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(16,185,129,0.16),transparent),radial-gradient(50%_40%_at_90%_20%,rgba(94,234,212,0.1),transparent)]" />
      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 p-[1px] shadow-lg shadow-emerald-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 text-base font-semibold text-emerald-100">
                AG
              </div>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-200/70">Agriflow</p>
              <p className="text-xs text-muted-foreground">Transparent trade for farmers & buyers</p>
            </div>
          </div>
          <Navbar />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/farmer"
            element={
              <RequireAuth role="farmer">
                <FarmerDashboardPage />
              </RequireAuth>
            }
          />
          <Route path="/market" element={<BuyerMarketplacePage />} />
          <Route
            path="/admin/verification"
            element={
              <RequireAuth role="admin">
                <AdminVerificationPage />
              </RequireAuth>
            }
          />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
