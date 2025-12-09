import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast.jsx";

function BuyerMarketplacePage() {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    const list = term
      ? products.filter(
          (p) =>
            p.productName?.toLowerCase().includes(term) ||
            p.farmerId?.username?.toLowerCase().includes(term)
        )
      : products;
    const start = (page - 1) * pageSize;
    return { total: list.length, data: list.slice(start, start + pageSize) };
  }, [products, search, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.total / pageSize));

  const handleRequest = async (productId) => {
    try {
      await api.post("/transactions", { productId, quantityPurchased: 1 });
      toast({ title: "Request sent", description: "Transaction recorded with qty 1." });
    } catch (err) {
      const msg = err.response?.data?.message || "Request failed.";
      toast({ title: "Request failed", description: msg });
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-lg shadow-emerald-500/5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Buyer view</p>
          <h2 className="text-3xl font-semibold tracking-tight">Marketplace</h2>
          <p className="text-sm text-muted-foreground">
            Browse static sample listings from smallholder farmers in Egypt.
          </p>
        </div>

        <form className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Tomatoes, potatoes..."
              className="w-72 border-slate-800 bg-slate-900/50"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            type="button"
            className="md:self-end"
            onClick={() => setPage(1)}
          >
            Apply filter
          </Button>
        </form>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <Card className="border border-slate-800/80 bg-slate-950/70 p-6">
            <p className="text-sm text-muted-foreground">Loading listings…</p>
          </Card>
        )}
        {error && !loading && (
          <Card className="border border-red-400/40 bg-red-500/5 p-6">
            <p className="text-sm text-red-300">{error}</p>
          </Card>
        )}
        {!loading && !error && products.length === 0 && (
          <Card className="border border-slate-800/80 bg-slate-950/70 p-6">
            <p className="text-sm text-muted-foreground">No products available yet.</p>
          </Card>
        )}
        {filtered.data.map((p) => (
          <Card
            key={p._id || p.id}
            className="flex flex-col justify-between border border-slate-800/80 bg-slate-950/70 shadow-sm shadow-emerald-500/5"
          >
            <div>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{p.productName}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Farmer: {p.farmerId?.username || p.farmer || "N/A"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-white">{p.pricePerUnit} EGP</span>
                  <span className="text-muted-foreground">per kg</span>
                </p>
                <p className="text-muted-foreground">Available quantity: {p.quantity} kg</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-slate-900/80 px-3 py-1">Cold chain ready</span>
                  <span className="rounded-full bg-slate-900/80 px-3 py-1">Cashless payout</span>
                </div>
              </CardContent>
            </div>
            <CardFooter>
              <Button
                variant="secondary"
                className="w-full"
                type="button"
                onClick={() => handleRequest(p._id || p.id)}
              >
                Request Offer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      {!loading && !error && filtered.total > pageSize && (
        <div className="flex items-center justify-end gap-3 text-sm text-muted-foreground">
          <span>
            Page {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default BuyerMarketplacePage;
