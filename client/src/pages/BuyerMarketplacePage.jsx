const dummyProducts = [
  { id: 1, productName: 'Tomatoes', farmer: 'farmer1', pricePerUnit: 2.5 },
  { id: 2, productName: 'Potatoes', farmer: 'farmer1', pricePerUnit: 1.8 }
];

function BuyerMarketplacePage() {
  return (
    <div>
      <h2>Marketplace</h2>
      <div>
        {dummyProducts.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', margin: '0.5rem', padding: '0.5rem' }}>
            <h4>{p.productName}</h4>
            <p>Farmer: {p.farmer}</p>
            <p>Price: {p.pricePerUnit} EGP/kg</p>
            <button type="button">View / Request (static)</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default BuyerMarketplacePage;
