const dummyListings = [
  { id: 1, productName: 'Tomatoes', quantity: 100, pricePerUnit: 2.5 },
  { id: 2, productName: 'Potatoes', quantity: 200, pricePerUnit: 1.8 }
];

function FarmerDashboardPage() {
  return (
    <div>
      <h2>Farmer Dashboard</h2>
      <h3>My Listings (static)</h3>
      <ul>
        {dummyListings.map(p => (
          <li key={p.id}>
            {p.productName} - {p.quantity} kg @ {p.pricePerUnit} EGP/kg
          </li>
        ))}
      </ul>

      <h3>Add New Listing (static)</h3>
      <form>
        <input placeholder="Product name" /><br />
        <input placeholder="Quantity" /><br />
        <input placeholder="Price per unit" /><br />
        <button type="button">Add Listing (static)</button>
      </form>
    </div>
  );
}
export default FarmerDashboardPage;
