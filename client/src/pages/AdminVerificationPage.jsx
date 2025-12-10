import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

function AdminVerificationPage() {
  const storedUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/buyer-verification");
        setBuyers(res.data);
      } catch (err) {
        setMessage({ type: "error", text: err.response?.data?.message || "Failed to load buyers." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    const list = term
      ? buyers.filter((b) =>
          (b.buyerId?.username || b.name || "").toLowerCase().includes(term) ||
          (b.buyerId?.email || b.email || "").toLowerCase().includes(term)
        )
      : buyers;
    const start = (page - 1) * pageSize;
    return { total: list.length, data: list.slice(start, start + pageSize) };
  }, [buyers, search, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.total / pageSize));

  const markVerified = async (buyerId) => {
    if (!storedUser) {
      setMessage({ type: "error", text: "Login as admin to verify buyers." });
      return;
    }
    setMessage(null);
    try {
      const res = await api.post(`/buyer-verification/${buyerId}/verify`);
      setBuyers((prev) =>
        prev.map((b) => (b._id === res.data._id || b.id === res.data._id ? res.data : b))
      );
      setMessage({ type: "success", text: "Buyer marked verified." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to verify buyer." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Admin view</p>
        <h2 className="text-3xl font-semibold tracking-tight">Buyer verification</h2>
        <p className="text-sm text-muted-foreground">
          Review and approve marketplace buyers. Live data from Mongo.
        </p>
      </div>

      <div className="flex items-end gap-3">
        <div className="w-64">
          <p className="text-xs text-muted-foreground mb-1">Search buyer</p>
          <Input
            placeholder="name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border-slate-800 bg-slate-900/60"
          />
        </div>
      </div>

      <Card className="border border-slate-800/80 bg-slate-950/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Pending & verified buyers</CardTitle>
          <CardDescription>Data fetched from `/api/buyer-verification`.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">Buyer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action (static)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell className="px-6 py-6 text-muted-foreground" colSpan={4}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filtered.data.length === 0 ? (
                <TableRow>
                  <TableCell className="px-6 py-6 text-muted-foreground" colSpan={4}>
                    No buyers yet.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.data.map((b) => (
                  <TableRow key={b._id || b.id}>
                    <TableCell className="px-6 font-medium">
                      {b.buyerId?.username || b.name || "Unknown"}
                    </TableCell>
                    <TableCell>{b.buyerId?.email || b.email}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          b.verifiedStatus || b.verified
                            ? "bg-emerald-500/10 text-emerald-200"
                            : "bg-amber-400/10 text-amber-200"
                        }`}
                      >
                        {b.verifiedStatus || b.verified ? "Verified" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        disabled={b.verifiedStatus || b.verified}
                        onClick={() => markVerified(b.buyerId?._id || b.buyerId || b.id)}
                      >
                        {b.verifiedStatus || b.verified ? "Done" : "Mark Verified"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!loading && filtered.total > pageSize && (
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
      {message && (
        <p className={message.type === "success" ? "text-sm text-emerald-400" : "text-sm text-red-400"}>
          {message.text}
        </p>
      )}
    </div>
  );
}
export default AdminVerificationPage;
