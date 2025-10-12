// frontend/src/pages/SamplePage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import ShareSample from "../components/shareSample"; // Import the ShareSample component
import "../style/sample.css";

interface Sample {
  id: string;
  sample_id: string;
  sample_type: string;
  collection_date: string;
  collection_time: string;
  geo_location: string;
  temperature: string;
  pH: string;
  salinity: string;
  reservation_date: string;
  reservation_time: string;
  status: string;
}

const SamplePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [sample, setSample] = useState<Sample | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine if we're in admin dashboard
  const isAdminDashboard = location.pathname.includes('/dashboard/');

  useEffect(() => {
    const fetchSample = async () => {
      try {
        if (!id) {
          setError("Invalid sample ID");
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/sample/${id}`);
        console.log("Sample data received:", res.data);
        setSample(res.data);
      } catch (err: unknown) {
        console.error("Error fetching sample:", err);
        
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError("No report found for this sample ID.");
          } else {
            setError(err.response?.data?.message || "Error loading sample data.");
          }
        } else if (err instanceof Error) {
          setError(err.message || "Error loading sample data.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSample();
  }, [id]);

  if (loading) return (
    <div className={`sample-content ${isAdminDashboard ? 'with-sidebar' : ''}`}>
      <div className="sample-loading">Loading sample...</div>
    </div>
  );
  
  if (error) return (
    <div className={`sample-content ${isAdminDashboard ? 'with-sidebar' : ''}`}>
      <div className="sample-error-container">
        <img
          src="/images/no-report.png"
          alt="No Report"
          className="no-report-img"
        />
        <p className="sample-error-text">{error}</p>
      </div>
    </div>
  );

  if (!sample) return (
    <div className={`sample-content ${isAdminDashboard ? 'with-sidebar' : ''}`}>
      <div className="sample-empty-container">
        <img
          src="/images/no-report.png"
          alt="No Report"
          className="no-report-img"
        />
        <p className="sample-empty-text">No report available yet.</p>
      </div>
    </div>
  );

  return (
    <div className={`sample-content ${isAdminDashboard ? 'with-sidebar' : ''}`}>
      <div className="sample-container">
        <div className="sample-card">
          <div className="sample-header">
            <h2 className="sample-title">
              {sample.sample_id || `Sample-${sample.id}`}
            </h2>
            {isAdminDashboard && (
              <span className="admin-badge">Admin View</span>
            )}
          </div>
          
          <p className="sample-info">
            <strong>Sample ID:</strong> {sample.sample_id || `Sample-${sample.id}`}
          </p>
          
          <p className="sample-info">
            <strong>Sample Type:</strong> {sample.sample_type || "Not specified"}
          </p>
          
          <p className="sample-date">
            <strong>Collection Date:</strong> {sample.collection_date ? new Date(sample.collection_date).toLocaleDateString() : "Not specified"}
          </p>
          
          {sample.collection_time && (
            <p className="sample-info">
              <strong>Collection Time:</strong> {sample.collection_time}
            </p>
          )}
          
          {sample.geo_location && (
            <p className="sample-info">
              <strong>Geolocation:</strong> {sample.geo_location}
            </p>
          )}
          
          {sample.temperature && (
            <p className="sample-info">
              <strong>Temperature:</strong> {sample.temperature}°C
            </p>
          )}
          
          {sample.pH && (
            <p className="sample-info">
              <strong>pH Level:</strong> {sample.pH}
            </p>
          )}
          
          {sample.salinity && (
            <p className="sample-info">
              <strong>Salinity:</strong> {sample.salinity} PSU
            </p>
          )}
          
          <p className="sample-info">
            <strong>Reservation Date:</strong> {new Date(sample.reservation_date).toLocaleDateString()}
          </p>
          
          <p className="sample-info">
            <strong>Reservation Time:</strong> {sample.reservation_time}
          </p>
          
          <p className="sample-info">
            <strong>Status:</strong> <span style={{ 
              color: sample.status === 'completed' ? '#2c5530' : 
                     sample.status === 'pending' ? '#ffa500' : '#dc3545',
              fontWeight: 'bold'
            }}>{sample.status}</span>
          </p>
        </div>

        {/* Add ShareSample component here for both admin and user */}
        <div className="share-section">
          <ShareSample sampleId={sample.id} />
        </div>
      </div>
    </div>
  );
};

export default SamplePage;