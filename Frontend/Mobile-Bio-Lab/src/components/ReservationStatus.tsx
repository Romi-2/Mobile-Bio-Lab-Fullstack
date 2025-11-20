// src/components/ReservationStatus.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserReservations, cancelReservation, type Reservation } from '../services/reservationservice';
import '../style/ReservationStatus.css';

const LOCAL_USER_KEY = 'loggedInUser';

interface LoggedInUser {
  id: number;
  name?: string;
  email?: string;
  role?: string;
}

// Enhanced Toast Component
const Toast: React.FC<{ 
  message: string; 
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button onClick={onClose} className="toast-close">×</button>
      </div>
    </div>
  );
};

const ReservationStatus: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  
  const navigate = useNavigate();

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  const handleNewReservation = () => {
    navigate('/reservation');
  };

  const handleBookAgain = () => {
    navigate('/reservation');
  };

  const fetchReservations = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const user = localStorage.getItem(LOCAL_USER_KEY);
      if (!user) {
        throw new Error('Please log in to view your reservations');
      }

      const parsedUser: LoggedInUser = JSON.parse(user);
      
      if (!parsedUser.id || typeof parsedUser.id !== 'number') {
        throw new Error('Invalid user information. Please log in again.');
      }

      const data = await getUserReservations();
      setReservations(data || []);
      
      if (data.length === 0) {
        showToast('No reservations found. Create your first reservation!', 'info');
      } else {
        showToast(`Loaded ${data.length} reservation(s) successfully`, 'success');
      }
    } catch (err: unknown) {
      console.error('Error fetching reservations:', err);
      let message = 'Failed to load reservations';
      if (err instanceof Error) message = err.message;
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCancelReservation = async (reservationId: number) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? This action cannot be undone.')) return;

    try {
      setCancellingId(reservationId);
      await cancelReservation(reservationId);
      showToast('Reservation cancelled successfully', 'success');
      await fetchReservations();
    } catch (err: unknown) {
      console.error('Error cancelling reservation:', err);
      let message = 'Failed to cancel reservation';
      if (err instanceof Error) message = err.message;
      showToast(message, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'approved': return 'status-badge status-approved';
      case 'rejected': return 'status-badge status-rejected';
      case 'pending': return 'status-badge status-pending';
      case 'cancelled': return 'status-badge status-cancelled';
      default: return 'status-badge status-pending';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'approved': return 'APPROVED';
      case 'rejected': return 'REJECTED';
      case 'pending': return 'PENDING';
      case 'cancelled': return 'CANCELLED';
      default: return status?.toUpperCase() || 'PENDING';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date?: string | null, time?: string | null): string => {
    if (!date) return time || 'Not scheduled';
    try {
      const dateObj = new Date(date);
      const dateStr = dateObj.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      return time ? `${dateStr} at ${time}` : dateStr;
    } catch {
      return `${date}${time ? ` at ${time}` : ''}`;
    }
  };

  const formatCollectionDateTime = (reservation: Reservation): string => {
    return formatDateTime(reservation.collection_date, reservation.collection_time);
  };

  // Separate reservations by status for better organization
  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const approvedReservations = reservations.filter(r => r.status === 'approved');
  const rejectedReservations = reservations.filter(r => r.status === 'rejected');
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled');

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  if (loading) {
    return (
      <div className="reservation-status">
        <h2>My Lab Reservations</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading your reservations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservation-status">
        <h2>My Lab Reservations</h2>
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
        <button onClick={fetchReservations} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="reservation-status">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast}
        />
      )}

      <div className="page-header">
        <h2>My Lab Reservations</h2>
        <div className="header-actions">
          <button onClick={fetchReservations} className="refresh-btn">
            Refresh
          </button>
          <button 
            onClick={handleNewReservation} 
            className="new-reservation-btn"
          >
            New Reservation
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="reservation-stats">
        <p>
          Total: {reservations.length} | 
          Pending: {pendingReservations.length} | 
          Approved: {approvedReservations.length} | 
          Rejected: {rejectedReservations.length} | 
          Cancelled: {cancelledReservations.length}
        </p>
      </div>

      {/* Pending Reservations */}
      {pendingReservations.length > 0 && (
        <div className="reservations-section">
          <h3 className="section-title">Pending Approval ({pendingReservations.length})</h3>
          <div className="reservations-grid">
            {pendingReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card pending">
                <div className="card-header">
                  <h4 className="reservation-title">Reservation #{reservation.id}</h4>
                  <span className={getStatusClass(reservation.status)}>
                    {getStatusText(reservation.status)}
                  </span>
                </div>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Lab:</span>
                    <span className="detail-value">
                      {reservation.slot_details?.lab_name || `Lab #${reservation.slot_id}`}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(reservation.reservation_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{reservation.reservation_time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{reservation.duration}</span>
                  </div>
                  {reservation.geo_location && (
                    <div className="detail-row">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{reservation.geo_location}</span>
                    </div>
                  )}
                </div>

                {/* Sample Information */}
                {reservation.sample_id && (
                  <div className="card-section">
                    <h5 className="section-label">Sample Information</h5>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="item-label">Sample ID:</span>
                        <span className="item-value">{reservation.sample_id}</span>
                      </div>
                      {reservation.sample_type && (
                        <div className="detail-item">
                          <span className="item-label">Type:</span>
                          <span className="item-value">{reservation.sample_type}</span>
                        </div>
                      )}
                      {reservation.collection_date && (
                        <div className="detail-item">
                          <span className="item-label">Collection:</span>
                          <span className="item-value">{formatCollectionDateTime(reservation)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Environmental Data */}
                {(reservation.temperature || reservation.pH || reservation.salinity) && (
                  <div className="card-section">
                    <h5 className="section-label">Environmental Data</h5>
                    <div className="detail-grid">
                      {reservation.temperature && (
                        <div className="detail-item">
                          <span className="item-label">Temperature:</span>
                          <span className="item-value">{reservation.temperature}°C</span>
                        </div>
                      )}
                      {reservation.pH && (
                        <div className="detail-item">
                          <span className="item-label">pH Level:</span>
                          <span className="item-value">{reservation.pH}</span>
                        </div>
                      )}
                      {reservation.salinity && (
                        <div className="detail-item">
                          <span className="item-label">Salinity:</span>
                          <span className="item-value">{reservation.salinity} PSU</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="card-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelReservation(reservation.id)}
                    disabled={cancellingId === reservation.id}
                  >
                    {cancellingId === reservation.id ? 'Cancelling...' : 'Cancel Reservation'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Reservations */}
      {approvedReservations.length > 0 && (
        <div className="reservations-section">
          <h3 className="section-title">Approved Reservations ({approvedReservations.length})</h3>
          <div className="reservations-grid">
            {approvedReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card approved">
                <div className="card-header">
                  <h4 className="reservation-title">Reservation #{reservation.id}</h4>
                  <span className={getStatusClass(reservation.status)}>
                    {getStatusText(reservation.status)}
                  </span>
                </div>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Lab:</span>
                    <span className="detail-value">
                      {reservation.slot_details?.lab_name || `Lab #${reservation.slot_id}`}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(reservation.reservation_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{reservation.reservation_time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{reservation.duration}</span>
                  </div>
                </div>

                {reservation.sample_id && (
                  <div className="card-section">
                    <h5 className="section-label">Sample Information</h5>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="item-label">Sample ID:</span>
                        <span className="item-value">{reservation.sample_id}</span>
                      </div>
                      {reservation.sample_type && (
                        <div className="detail-item">
                          <span className="item-label">Type:</span>
                          <span className="item-value">{reservation.sample_type}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="card-status">
                  <span className="success-message">✅ Ready to use in the lab</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected Reservations */}
      {rejectedReservations.length > 0 && (
        <div className="reservations-section">
          <h3 className="section-title">Rejected Reservations ({rejectedReservations.length})</h3>
          <div className="reservations-grid">
            {rejectedReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card rejected">
                <div className="card-header">
                  <h4 className="reservation-title">Reservation #{reservation.id}</h4>
                  <span className={getStatusClass(reservation.status)}>
                    {getStatusText(reservation.status)}
                  </span>
                </div>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Lab:</span>
                    <span className="detail-value">
                      {reservation.slot_details?.lab_name || `Lab #${reservation.slot_id}`}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(reservation.reservation_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{reservation.reservation_time}</span>
                  </div>
                </div>

                {reservation.rejection_reason && (
                  <div className="card-section">
                    <h5 className="section-label">Rejection Reason</h5>
                    <div className="rejection-reason">
                      {reservation.rejection_reason}
                    </div>
                  </div>
                )}

                <div className="card-actions">
                  <button className="contact-btn">
                    Contact Administrator
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Reservations */}
      {cancelledReservations.length > 0 && (
        <div className="reservations-section">
          <h3 className="section-title">Cancelled Reservations ({cancelledReservations.length})</h3>
          <div className="reservations-grid">
            {cancelledReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card cancelled">
                <div className="card-header">
                  <h4 className="reservation-title">Reservation #{reservation.id}</h4>
                  <span className={getStatusClass(reservation.status)}>
                    {getStatusText(reservation.status)}
                  </span>
                </div>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Lab:</span>
                    <span className="detail-value">
                      {reservation.slot_details?.lab_name || `Lab #${reservation.slot_id}`}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(reservation.reservation_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{reservation.reservation_time}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button 
                    onClick={handleBookAgain} 
                    className="book-again-btn"
                  >
                    Book New Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {reservations.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No Reservations Found</h3>
          <p>You haven't made any lab reservations yet.</p>
          <button 
            onClick={handleNewReservation} 
            className="new-reservation-btn primary"
          >
            Create Your First Reservation
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationStatus;