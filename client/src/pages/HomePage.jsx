import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "@/lib/auth";

function HomePage() {
  const navigate = useNavigate();
  const user = useAuthUser();

  const goFarmer = () => navigate("/farmer");
  const goBuyer = () => navigate("/market");
  const goAdmin = () => navigate("/admin/verification");

  return (
    <div className="space-y-10">
      <section className="grid items-center gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100 shadow-sm shadow-emerald-500/20">
            Real-time, transparent agri-trade
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Clean, modern marketplace for farmers, buyers, and admins
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            AgriFlow connects smallholder farmers directly with vetted buyers. Clear pricing, secure payments,
            verifications, and transaction history all in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
              type="button"
              onClick={goFarmer}
            >
              {user?.role === "farmer" ? "Go to Farmer dashboard" : "Enter as Farmer"}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="border border-slate-800/80"
              type="button"
              onClick={goBuyer}
            >
              Browse marketplace
            </Button>
            {user?.role === "admin" && (
              <Button
                size="lg"
                variant="outline"
                className="border border-emerald-400/50 text-emerald-100"
                type="button"
                onClick={goAdmin}
              >
                Admin verification
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Instant verifications
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Clear audit trails
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Fair pricing cues
            </span>
          </div>
        </div>

        <Card className="border border-slate-800/70 bg-slate-950/60 shadow-xl shadow-emerald-500/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Today&apos;s activity (static)</CardTitle>
            <CardDescription>Signal-rich snapshot from our demo data.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800/70 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Active listings</p>
              <p className="mt-2 text-3xl font-semibold text-white">32</p>
              <p className="text-xs text-emerald-200/80">+4 today</p>
            </div>
            <div className="rounded-lg border border-slate-800/70 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Verified buyers</p>
              <p className="mt-2 text-3xl font-semibold text-white">12</p>
              <p className="text-xs text-emerald-200/80">100% KYC checked</p>
            </div>
            <div className="rounded-lg border border-slate-800/70 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Transactions this week</p>
              <p className="mt-2 text-3xl font-semibold text-white">18</p>
              <p className="text-xs text-emerald-200/80">Stable volume</p>
            </div>
            <div className="rounded-lg border border-slate-800/70 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Fulfillment score</p>
              <p className="mt-2 text-3xl font-semibold text-white">94%</p>
              <p className="text-xs text-emerald-200/80">On-time pickups</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "For Farmers",
            body: "List crops quickly, reach verified buyers, and track payouts from one clean dashboard.",
          },
          {
            title: "For Buyers",
            body: "Discover credible suppliers, compare offers, and request deals with full transparency.",
          },
          {
            title: "For Admins",
            body: "Review verifications, monitor marketplace health, and keep every transaction auditable.",
          },
        ].map((item) => (
          <Card key={item.title} className="border border-slate-800/70 bg-slate-950/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {item.body}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

export default HomePage;
