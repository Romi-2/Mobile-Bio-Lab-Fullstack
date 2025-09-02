import "../../style/AdminDashboard.css";

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Welcome, User!</h1>

      {/* Stats / Cards */}
      <div className="dashboard-cards-row">
        <div className="card">Total Orders: 12</div>
        <div className="card">Pending Orders: 3</div>
        <div className="card">Profile Completeness: 80%</div>
      </div>

      {/* Recent Activity Table */}
      <div className="dashboard-recent-activity">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#12345</td>
              <td>2025-08-30</td>
              <td>Completed</td>
              <td>$120</td>
            </tr>
            <tr>
              <td>#12346</td>
              <td>2025-08-28</td>
              <td>Pending</td>
              <td>$80</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <button>Update Profile</button>
        <button>New Order</button>
        <button>View History</button>
      </div>
    </div>
  );
};

export default UserDashboard;
