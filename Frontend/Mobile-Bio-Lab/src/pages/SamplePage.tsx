// frontend/src/pages/SamplePage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ShareSample from "../components/shareSample";
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
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState("");
  const [sample, setSample] = useState<Sample | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdminDashboard = location.pathname.includes("/dashboard/");

  const fetchSample = async (sampleId: string) => {
    setLoading(true);
    setError(null);
    setSample(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/sample/${sampleId}`);
      setSample(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError("No report found for this sample ID.");
        } else {
          setError(err.response?.data?.message || "Error loading sample data.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load sample from URL param on page load
  useEffect(() => {
    if (id) fetchSample(id);
  }, [id]);

  const handleSearch = () => {
  if (!searchId.trim()) {
    setError("Please enter a valid sample ID");
    return;
  }

  // Detect if currently inside admin dashboard
  if (location.pathname.includes("/adminDashboard/")) {
    navigate(`/adminDashboard/sample/${searchId}`);
  } else {
    navigate(`/dashboard/sample/${searchId}`);
  }

  fetchSample(searchId);
};


  return (
    <div className={`sample-content ${isAdminDashboard ? "with-sidebar" : ""}`}>
      {/* 🔍 Search Bar */}
      <div className="sample-search-container">
        <input
          type="text"
          placeholder="Enter Sample ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="sample-search-input"
        />
        <button onClick={handleSearch} className="sample-search-button">
          Search
        </button>
      </div>

      {loading && <div className="sample-loading">Loading sample...</div>}
      {error && (
        <div className="sample-error-container">
          <img src="/images/no-report.png" alt="No Report" className="no-report-img" />
          <p className="sample-error-text">{error}</p>
        </div>
      )}

      {!loading && !error && sample && (
        <div className="sample-container">
          <div className="sample-card">
            <div className="sample-header">
              <h2 className="sample-title">
                {sample.sample_id || `Sample-${sample.id}`}
              </h2>
              {isAdminDashboard && <span className="admin-badge">Admin View</span>}
            </div>

            <p><strong>Sample ID:</strong> {sample.sample_id}</p>
            <p><strong>Sample Type:</strong> {sample.sample_type}</p>
            <p><strong>Collection Date:</strong> {new Date(sample.collection_date).toLocaleDateString()}</p>
            <p><strong>Temperature:</strong> {sample.temperature}°C</p>
            <p><strong>pH:</strong> {sample.pH}</p>
            <p><strong>Salinity:</strong> {sample.salinity}</p>
            <p><strong>Status:</strong> {sample.status}</p>
          </div>

          <div className="share-section">
            <ShareSample sampleId={sample.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SamplePage;
