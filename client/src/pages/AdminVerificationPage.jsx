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

// Reusable Table Component to avoid code duplication
const UserTable = ({ title, data, search, onSearchChange, page, onPageChange, onToggle, loading }) => {
  const pageSize = 5;
  
  // Filter Logic inside the component
  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    const list = term
      ? data.filter((item) =>
          (item.userInfo?.username || "").toLowerCase().includes(term) ||
          (item.userInfo?.email || "").toLowerCase().includes(term)
        )
      : data;
    const start = (page - 1) * pageSize;
    return { total: list.length, data: list.slice(start, start + pageSize) };
  }, [data, search, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.total / pageSize));

  return (
    <Card className="border border-slate-800/80 bg-slate-950/70 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>Total: {data.length}</CardDescription>
          </div>
          <div className="w-40">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onPageChange(1); // Reset to page 1 on search
              }}
              className="h-8 text-xs border-slate-800 bg-slate-900/60"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 flex-1">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800/50 hover:bg-transparent">
              <TableHead className="pl-4">User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-4 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.data.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-4 text-muted-foreground">No records found.</TableCell></TableRow>
            ) : (
              filtered.data.map((row) => (
                <TableRow key={row.userInfo._id} className="border-slate-800/50">
                  <TableCell className="pl-4 py-3">
                    <div className="font-medium text-slate-200">{row.userInfo.username}</div>
                    <div className="text-xs text-muted-foreground">{row.userInfo.email}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.verifiedStatus 
                        ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                    }`}>
                      {row.verifiedStatus ? "Verified" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggle(row.userInfo._id, row.verifiedStatus)}
                      className={`h-7 px-3 text-xs ${
                        row.verifiedStatus 
                          ? "text-red-400 hover:text-red-300 hover:bg-red-950/30" 
                          : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30"
                      }`}
                    >
                      {row.verifiedStatus ? "Revoke" : "Approve"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      
      {/* Pagination Footer */}
      {!loading && filtered.total > pageSize && (
        <div className="flex items-center justify-between border-t border-slate-800/50 p-3 text-xs">
          <span className="text-muted-foreground">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => onPageChange(p => Math.max(1, p - 1))} disabled={page === 1}>&lt;</Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => onPageChange(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>&gt;</Button>
          </div>
        </div>
      )}
    </Card>
  );
};

function AdminVerificationPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Separate states for the two tables
  const [buyerSearch, setBuyerSearch] = useState("");
  const [buyerPage, setBuyerPage] = useState(1);

  const [farmerSearch, setFarmerSearch] = useState("");
  const [farmerPage, setFarmerPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/buyer-verification");
        setData(res.data);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load users." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Split data into two lists
  const farmers = useMemo(() => data.filter(d => d.userInfo.role === 'farmer'), [data]);
  const buyers = useMemo(() => data.filter(d => d.userInfo.role === 'buyer'), [data]);

  const toggleVerification = async (userId, currentStatus) => {
    setMessage(null);
    try {
      await api.put(`/buyer-verification/${userId}`, { status: !currentStatus });
      
      // Update local state for immediate feedback
      setData((prev) => prev.map((item) => 
        item.userInfo._id === userId ? { ...item, verifiedStatus: !currentStatus } : item
      ));
      
      const action = !currentStatus ? "Verified" : "Unverified";
      setMessage({ type: "success", text: `User successfully ${action}.` });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update status." });
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col gap-1 flex-shrink-0">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Admin Console</p>
        <h2 className="text-3xl font-semibold tracking-tight">User Verification</h2>
        <p className="text-sm text-muted-foreground">
          Manage access for all platform participants.
        </p>
        {message && (
          <div className={`mt-2 text-sm px-3 py-2 rounded-md border ${
            message.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* BUYERS TABLE */}
        <UserTable 
          title="Buyers" 
          data={buyers}
          search={buyerSearch}
          onSearchChange={setBuyerSearch}
          page={buyerPage}
          onPageChange={setBuyerPage}
          onToggle={toggleVerification}
          loading={loading}
        />

        {/* FARMERS TABLE */}
        <UserTable 
          title="Farmers" 
          data={farmers}
          search={farmerSearch}
          onSearchChange={setFarmerSearch}
          page={farmerPage}
          onPageChange={setFarmerPage}
          onToggle={toggleVerification}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default AdminVerificationPage;