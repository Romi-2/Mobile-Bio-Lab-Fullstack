import "../style/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleReservationClick = () => {
    navigate("/slot-reservation");
  };

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

        {/* Reservation card with button */}
        <div className="card">
          <h2>Reservation System</h2>
          <p>
            Registered users can reserve slots to access the mobile bio lab on wheels.
          </p>
          <button className="reservation-btn" onClick={handleReservationClick}>
            Reserve Now
          </button>
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
