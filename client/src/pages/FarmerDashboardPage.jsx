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

const dummyListings = [
  { id: 1, productName: "Tomatoes", quantity: 100, pricePerUnit: 2.5, status: "Active" },
  { id: 2, productName: "Potatoes", quantity: 200, pricePerUnit: 1.8, status: "Active" },
  { id: 3, productName: "Onions", quantity: 60, pricePerUnit: 3.2, status: "Draft" },
];

function FarmerDashboardPage() {
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
          { label: "Active listings", value: "2", chip: "+1 today" },
          { label: "Available stock", value: "360 kg", chip: "ready to ship" },
          { label: "Avg. price / kg", value: "2.5 EGP", chip: "fair market" },
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
            <CardTitle className="text-lg">My listings (static)</CardTitle>
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
                {dummyListings.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="px-6 font-medium">{p.productName}</TableCell>
                    <TableCell>{p.quantity} kg</TableCell>
                    <TableCell>{p.pricePerUnit} EGP</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          p.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-200"
                            : "bg-amber-400/10 text-amber-200"
                        }`}
                      >
                        {p.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border border-slate-800/80 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Add a listing (static)</CardTitle>
            <CardDescription>Preview the flow you&apos;ll use for real data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="product">Product name</Label>
              <Input id="product" placeholder="Tomatoes" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input id="quantity" type="number" placeholder="150" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price per kg (EGP)</Label>
                <Input id="price" type="number" placeholder="2.5" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" placeholder="Organic, next-day pickup..." />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Static demo — no API call yet.</p>
            <Button size="sm" className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400">
              Save listing
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
export default FarmerDashboardPage;
