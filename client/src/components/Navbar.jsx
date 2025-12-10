import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout, useAuthUser } from "@/lib/auth";

function Navbar() {
  const navigate = useNavigate();
  const user = useAuthUser();

  const links = [
    { to: "/", label: "Home" },
    { to: "/market", label: "Marketplace" },
    ...(user?.role === "farmer" ? [{ to: "/farmer", label: "Farmer" }] : []),
    ...(user?.role === "admin" ? [{ to: "/admin/verification", label: "Admin" }] : []),
    { to: "/transactions", label: "Transactions" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center gap-3">
      <div className="flex items-center gap-1 rounded-full border border-slate-800/80 bg-slate-900/70 px-2 py-1 text-sm shadow-lg shadow-emerald-500/5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-full px-3 py-1 font-medium transition ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/60"
                  : "text-slate-200 hover:bg-slate-800/80"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <div className="hidden md:flex items-center gap-2">
        {user ? (
          <>
            <span className="text-xs text-muted-foreground">Hi, {user.username}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-200 hover:text-white"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink to="/login">
              <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white">
                Login
              </Button>
            </NavLink>
            <NavLink to="/register">
              <Button size="sm" className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400">
                Get Started
              </Button>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
