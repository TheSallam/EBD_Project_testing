import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const dummyProducts = [
  { id: 1, productName: "Tomatoes", farmer: "farmer1", pricePerUnit: 2.5, quantity: 100 },
  { id: 2, productName: "Potatoes", farmer: "farmer1", pricePerUnit: 1.8, quantity: 200 },
  { id: 3, productName: "Onions", farmer: "farmer2", pricePerUnit: 3.0, quantity: 80 }
];

function BuyerMarketplacePage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Marketplace</h2>
          <p className="text-sm text-muted-foreground">
            Browse static sample listings from smallholder farmers in Egypt.
          </p>
        </div>

        <form className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Tomatoes, potatoes..."
              className="w-64"
            />
          </div>
          <Button type="button" className="md:self-end">
            Filter (static)
          </Button>
        </form>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dummyProducts.map((p) => (
          <Card key={p.id} className="flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{p.productName}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Farmer: {p.farmer}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">{p.pricePerUnit} EGP</span>{" "}
                  <span className="text-muted-foreground">per kg</span>
                </p>
                <p className="text-muted-foreground">
                  Available quantity: {p.quantity} kg
                </p>
              </CardContent>
            </div>
            <CardFooter>
              <Button variant="secondary" className="w-full" type="button">
                Request Offer (static)
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  );
}

export default BuyerMarketplacePage;
