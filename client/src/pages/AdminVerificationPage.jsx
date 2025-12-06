const dummyBuyers = [
  { id: 1, name: 'buyer1', email: 'buyer1@test.com', verified: true },
  { id: 2, name: 'buyer2', email: 'buyer2@test.com', verified: false }
];

function AdminVerificationPage() {
  return (
    <div>
      <h2>Buyer Verification (Admin)</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
        Review and approve marketplace buyers. Static demo for Milestone 2.
      </p>
      <table>
        <thead>
          <tr>
            <th>Buyer</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action (static)</th>
          </tr>
        </thead>
        <tbody>
          {dummyBuyers.map(b => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.email}</td>
              <td>
                <span className={`badge ${b.verified ? 'success' : 'pending'}`}>
                  {b.verified ? 'Verified' : 'Pending'}
                </span>
              </td>
              <td>
                <button className="btn secondary" type="button">
                  Mark Verified
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AdminVerificationPage;
