import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { useAuthUser } from "@/lib/auth";

function TransactionsPage() {
  const user = useAuthUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/transactions");
        setItems(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dynamic Title based on Role
  const getTitle = () => {
    if (user?.role === "farmer") return "My Sales";
    if (user?.role === "buyer") return "My Purchase History";
    return "Global Transaction Audit";
  };

  const getDescription = () => {
    if (user?.role === "farmer") return "Track sold crops and revenue.";
    if (user?.role === "buyer") return "Review your past orders.";
    return "Monitoring all platform activity.";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">
          {user?.role || "System"} View
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">{getTitle()}</h2>
        <p className="text-sm text-muted-foreground">{getDescription()}</p>
      </div>

      <Card className="border border-slate-800/80 bg-slate-950/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Records</CardTitle>
          <CardDescription>Live data from Mongo.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">Date</TableHead>
                <TableHead>Product</TableHead>
                {/* Conditionally hide columns based on role if you want, usually seeing both parties is fine */}
                <TableHead>Buyer</TableHead> 
                <TableHead>Farmer</TableHead>
                <TableHead>Qty (kg)</TableHead>
                <TableHead className="text-right">Total (EGP)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell className="px-6 py-6 text-muted-foreground" colSpan={6}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell className="px-6 py-6 text-red-400" colSpan={6}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell className="px-6 py-6 text-muted-foreground" colSpan={6}>
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((t) => (
                  <TableRow key={t._id || t.id}>
                    <TableCell className="px-6 text-muted-foreground">
                      {new Date(t.transactionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      {t.productId?.productName || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {t.buyerId?.username || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {t.productId?.farmerId?.username || "Unknown"}
                    </TableCell>
                    <TableCell>{t.quantityPurchased}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-400">
                      {t.totalPrice}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionsPage;