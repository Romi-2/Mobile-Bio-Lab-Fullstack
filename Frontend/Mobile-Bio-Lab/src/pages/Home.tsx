import "../style/Home.css";

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Mobile Bio Lab</h1>
        <p>Your trusted platform for managing lab samples and data efficiently.</p>
      </header>

      <section className="home-content">
        <div className="card">
          <h2>Device Integration</h2>
          <p>
            Connect to BLE devices to capture real-time environmental or biological data.
          </p>
        </div>
        <div className="card">
          <h2>Reservation System</h2>
          <p>
            Registered users can reserve slots to access the mobile bio lab on wheels.
          </p>
        </div>
        <div className="card">
          <h2>Reliable Notifications</h2>
          <p>
            Stay updated with instant notifications for activations, approvals,
            and updates.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
