import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuthUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast"; // Import Toast

function FarmerDashboardPage() {
  const user = useAuthUser();
  const { toast } = useToast(); // Initialize hook
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({ productName: "", pricePerUnit: "", quantity: "" });

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      // Updated to use the dedicated endpoint
      const res = await api.get("/products/my-products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: "Failed to load your products." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyProducts();
  }, [user]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/products", formData);
      setProducts([res.data, ...products]); // Prepend new product
      setFormData({ productName: "", pricePerUnit: "", quantity: "" });
      toast({ title: "Success", description: "Listing posted successfully!" });
    } catch (err) {
      // Logic: Show the error message from backend (which is now "Account not verified...")
      const msg = err.response?.data?.message || "Failed to add product";
      toast({ 
        variant: "destructive", 
        title: "Action Denied", 
        description: msg 
      });
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete this listing?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast({ title: "Deleted", description: "Listing removed." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete listing." });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,350px]">
      {/* Left: Product List */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">My Farm</h2>
          <p className="text-muted-foreground">Manage your active listings.</p>
        </div>

        <Card className="border border-slate-800/80 bg-slate-950/70">
          <CardHeader>
            <CardTitle>My Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow> : 
                 products.length === 0 ? <TableRow><TableCell colSpan={5}>No listings yet.</TableCell></TableRow> :
                 products.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium text-slate-200">{p.productName}</TableCell>
                    <TableCell>{p.quantity} kg</TableCell>
                    <TableCell>{p.pricePerUnit} EGP</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${p.isAvailable ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {p.isAvailable ? "Active" : "Sold Out"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => handleDelete(p._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Add Product Form */}
      <div>
        <Card className="border border-emerald-500/20 bg-slate-950/60 shadow-lg shadow-emerald-500/5 sticky top-6">
          <CardHeader>
            <CardTitle>Post New Crop</CardTitle>
            <CardDescription>Add fresh produce to the market.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Crop Name</Label>
                <Input 
                  id="productName" 
                  placeholder="e.g. Potatoes" 
                  className="bg-slate-900 border-slate-800"
                  value={formData.productName}
                  onChange={e => setFormData({...formData, productName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (EGP)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00" 
                    className="bg-slate-900 border-slate-800"
                    value={formData.pricePerUnit}
                    onChange={e => setFormData({...formData, pricePerUnit: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Qty (kg)</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    placeholder="0" 
                    className="bg-slate-900 border-slate-800"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                Publish Listing
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FarmerDashboardPage;