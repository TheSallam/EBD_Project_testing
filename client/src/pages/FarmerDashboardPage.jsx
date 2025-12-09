import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";

function FarmerDashboardPage() {
  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    productName: "",
    quantity: "",
    pricePerUnit: "",
    description: "",
  });

  useEffect(() => {
    const fetchMine = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        // If user is a farmer, show only their products; otherwise show all.
        const mine = storedUser?.role === "farmer"
          ? res.data.filter((p) => p.farmerId?._id === storedUser.id || p.farmerId === storedUser?.id)
          : res.data;
        setProducts(mine);
      } catch (err) {
        setMessage({ type: "error", text: err.response?.data?.message || "Failed to load listings." });
      } finally {
        setLoading(false);
      }
    };
    fetchMine();
  }, [storedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!storedUser) {
      setMessage({ type: "error", text: "Please login as a farmer first." });
      return;
    }
    if (storedUser.role !== "farmer") {
      setMessage({ type: "error", text: "Only farmer accounts can create listings." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        productName: form.productName,
        quantity: Number(form.quantity),
        pricePerUnit: Number(form.pricePerUnit),
        description: form.description,
        farmerId: storedUser.id,
        isAvailable: true,
      };
      const res = await api.post("/products", payload);
      setProducts((prev) => [res.data, ...prev]);
      setMessage({ type: "success", text: "Listing created." });
      setForm({ productName: "", quantity: "", pricePerUnit: "", description: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to create listing." });
    } finally {
      setSaving(false);
    }
  };

  const activeCount = products.filter((p) => p.isAvailable !== false).length;
  const totalQty = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const avgPrice = products.length
    ? (products.reduce((sum, p) => sum + Number(p.pricePerUnit || 0), 0) / products.length).toFixed(2)
    : "0";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Farmer view</p>
        <h2 className="text-3xl font-semibold tracking-tight">Manage your listings</h2>
        <p className="text-sm text-muted-foreground">
          Keep inventory up to date and preview how buyers will see your offers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Active listings", value: loading ? "…" : String(activeCount), chip: "live" },
          { label: "Available stock", value: loading ? "…" : `${totalQty} kg`, chip: "ready to ship" },
          { label: "Avg. price / kg", value: loading ? "…" : `${avgPrice} EGP`, chip: "market" },
        ].map((item) => (
          <Card key={item.label} className="border border-slate-800/80 bg-slate-950/70">
            <CardHeader className="pb-2">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
            </CardHeader>
            <CardFooter className="pt-0 text-xs text-emerald-200/80">{item.chip}</CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.9fr]">
        <Card className="border border-slate-800/80 bg-slate-950/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">My listings</CardTitle>
            <CardDescription>Shown to verified buyers.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6">Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price / kg</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell className="px-6 py-6 text-muted-foreground" colSpan={4}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-6 py-6 text-muted-foreground" colSpan={4}>
                      No listings yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((p) => (
                    <TableRow key={p._id || p.id}>
                      <TableCell className="px-6 font-medium">{p.productName}</TableCell>
                      <TableCell>{p.quantity} kg</TableCell>
                      <TableCell>{p.pricePerUnit} EGP</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            p.isAvailable !== false
                              ? "bg-emerald-500/10 text-emerald-200"
                              : "bg-amber-400/10 text-amber-200"
                          }`}
                        >
                          {p.isAvailable !== false ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border border-slate-800/80 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Add a listing</CardTitle>
            <CardDescription>Data will be saved to Mongo via the API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <form className="space-y-3" onSubmit={handleCreate}>
              <div className="space-y-1.5">
                <Label htmlFor="productName">Product name</Label>
                <Input
                  id="productName"
                  name="productName"
                  placeholder="Tomatoes"
                  value={form.productName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="150"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pricePerUnit">Price per kg (EGP)</Label>
                  <Input
                    id="pricePerUnit"
                    name="pricePerUnit"
                    type="number"
                    placeholder="2.5"
                    value={form.pricePerUnit}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Notes</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Organic, next-day pickup..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-muted-foreground">
                  Requires login as a farmer. Saved via `/api/products`.
                </p>
                <Button
                  size="sm"
                  className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save listing"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {message && (
        <p className={message.type === "success" ? "text-sm text-emerald-400" : "text-sm text-red-400"}>
          {message.text}
        </p>
      )}
    </div>
  );
}
export default FarmerDashboardPage;
