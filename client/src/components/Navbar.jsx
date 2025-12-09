import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout, useAuthUser } from "@/lib/auth";
import { ThemeToggle } from "./ThemeToggle"; // Import the toggle

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
      {/* Updated container colors to use variables */}
      <div className="flex items-center gap-1 rounded-full border border-border bg-card/80 backdrop-blur-sm px-2 py-1 text-sm shadow-sm">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-full px-3 py-1 font-medium transition ${
                isActive
                  ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {/* Insert Toggle Button */}
        <ThemeToggle />

        {user ? (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Hi, {user.username}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Login
              </Button>
            </NavLink>
            <NavLink to="/register">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;