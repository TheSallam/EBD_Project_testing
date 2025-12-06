const dummyTransactions = [
  { id: 1, buyer: 'buyer1', product: 'Tomatoes', quantity: 10, totalPrice: 25 },
  { id: 2, buyer: 'buyer2', product: 'Potatoes', quantity: 20, totalPrice: 36 }
];

function TransactionsPage() {
  return (
    <div>
      <h2>Transaction History</h2>
      <table>
        <thead>
          <tr>
            <th>Buyer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total (EGP)</th>
          </tr>
        </thead>
        <tbody>
          {dummyTransactions.map(t => (
            <tr key={t.id}>
              <td>{t.buyer}</td>
              <td>{t.product}</td>
              <td>{t.quantity}</td>
              <td>{t.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default TransactionsPage;
