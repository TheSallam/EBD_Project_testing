import { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
  const [email, setEmail] = useState("buyer1@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage({ type: "success", text: `Logged in as ${user.role} (${user.email})` });
    } catch (err) {
      const text =
        err.response?.data?.message || "Login failed. Please check your credentials.";
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      
      <Card className="w-full max-w-md shadow-2xl border border-slate-800 bg-slate-950/70">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription>
            Sign in to AgriFlow to manage listings and marketplace activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900/60 border-slate-700"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900/60 border-slate-700"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          {message && (
            <p
              className={
                message.type === "success"
                  ? "text-sm text-emerald-400"
                  : "text-sm text-red-400"
              }
            >
              {message.text}
            </p>
          )}
          <p className="text-xs text-slate-400">
            Test users: e.g. <code>buyer1@test.com / 123456</code> or any account you
            created in Postman.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
