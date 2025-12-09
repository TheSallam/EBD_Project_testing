import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dummyTransactions = [
  { id: 1, buyer: "buyer1", product: "Tomatoes", quantity: 10, totalPrice: 25 },
  { id: 2, buyer: "buyer2", product: "Potatoes", quantity: 20, totalPrice: 36 },
  { id: 3, buyer: "buyer1", product: "Onions", quantity: 12, totalPrice: 38.4 },
];

function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Shared view</p>
        <h2 className="text-3xl font-semibold tracking-tight">Transaction history</h2>
        <p className="text-sm text-muted-foreground">
          Sample transaction log so you can see the end-to-end flow.
        </p>
      </div>

      <Card className="border border-slate-800/80 bg-slate-950/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent transactions (static)</CardTitle>
          <CardDescription>Data is mocked for UI only.</CardDescription>
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
              {dummyTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="px-6 font-medium">{t.buyer}</TableCell>
                  <TableCell>{t.product}</TableCell>
                  <TableCell>{t.quantity}</TableCell>
                  <TableCell className="font-semibold text-white">{t.totalPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
export default TransactionsPage;
