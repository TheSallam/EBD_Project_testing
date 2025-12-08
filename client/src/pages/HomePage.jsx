import { Button } from "@/components/ui/button";

function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-[2fr,1.5fr] items-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-emerald-500">Digital B2B Marketplace</h1>
          <h1 className="text-4xl text-emerald-400">Test heading</h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            AgriFlow connects smallholder farmers directly with verified buyers,
            enabling transparent pricing, secure digital payments, and a clear
            transaction history that can support financial inclusion.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" type="button">
              Enter as Farmer (static)
            </Button>
            <Button size="lg" variant="secondary" type="button">
              Enter as Buyer (static)
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 space-y-3 text-sm">
          <h2 className="font-medium">Today&apos;s Sample Activity (static)</h2>
          <div className="flex justify-between text-muted-foreground">
            <span>Active listings</span>
            <span className="font-semibold text-foreground">32</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Verified buyers</span>
            <span className="font-semibold text-foreground">12</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Transactions this week</span>
            <span className="font-semibold text-foreground">18</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3 text-sm">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-medium mb-1">For Farmers</h3>
          <p className="text-muted-foreground">
            List crops, reach more buyers, and track sales from a simple
            dashboard.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-medium mb-1">For Buyers</h3>
          <p className="text-muted-foreground">
            Discover verified farmers, compare offers, and request deals in one
            place.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-medium mb-1">For Admins</h3>
          <p className="text-muted-foreground">
            Verify buyers, monitor transactions, and keep the marketplace safe.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
