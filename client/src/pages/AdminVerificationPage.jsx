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

const dummyBuyers = [
  { id: 1, name: "buyer1", email: "buyer1@test.com", verified: true },
  { id: 2, name: "buyer2", email: "buyer2@test.com", verified: false },
];

function AdminVerificationPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Admin view</p>
        <h2 className="text-3xl font-semibold tracking-tight">Buyer verification</h2>
        <p className="text-sm text-muted-foreground">
          Review and approve marketplace buyers. This screen is static for now.
        </p>
      </div>

      <Card className="border border-slate-800/80 bg-slate-950/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Pending & verified buyers</CardTitle>
          <CardDescription>Mock data illustrating the final review flow.</CardDescription>
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
              {dummyBuyers.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="px-6 font-medium">{b.name}</TableCell>
                  <TableCell>{b.email}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        b.verified
                          ? "bg-emerald-500/10 text-emerald-200"
                          : "bg-amber-400/10 text-amber-200"
                      }`}
                    >
                      {b.verified ? "Verified" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary" size="sm" type="button">
                      Mark Verified
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
export default AdminVerificationPage;
