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
          <h2>Fast Registration</h2>
          <p>
            Easily register users with just a few clicks and keep track of their
            status securely.
          </p>
        </div>
        <div className="card">
          <h2>Secure Dashboard</h2>
          <p>
            Admins have access to an advanced dashboard to manage approvals,
            updates, and more.
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
