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

function TransactionsPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Shared view</p>
        <h2 className="text-3xl font-semibold tracking-tight">Transaction history</h2>
        <p className="text-sm text-muted-foreground">
          Pulled from the live API.
        </p>
      </div>

      <Card className="border border-slate-800/80 bg-slate-950/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent transactions</CardTitle>
          <CardDescription>Fetched from `/api/transactions`.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">Buyer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total (EGP)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell className="px-6 py-6 text-muted-foreground" colSpan={4}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell className="px-6 py-6 text-red-400" colSpan={4}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell className="px-6 py-6 text-muted-foreground" colSpan={4}>
                    No transactions yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((t) => (
                  <TableRow key={t._id || t.id}>
                    <TableCell className="px-6 font-medium">
                      {t.buyerId?.username || t.buyer || "N/A"}
                    </TableCell>
                    <TableCell>{t.productId?.productName || t.product || "N/A"}</TableCell>
                    <TableCell>{t.quantityPurchased || t.quantity}</TableCell>
                    <TableCell className="font-semibold text-white">{t.totalPrice}</TableCell>
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
