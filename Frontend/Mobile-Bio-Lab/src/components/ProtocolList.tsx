// frontend/src/components/ProtocolList.tsx
import React, { useState, useEffect } from "react";
import { getProtocols } from "../services/protocolservice";
import type { Protocol } from "../services/protocolservice";
import "../style/Protocol.css";

const ProtocolsList: React.FC = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProtocols();
  }, []);

  const fetchProtocols = async () => {
    try {
      const data = await getProtocols();
      setProtocols(data);
    } catch (err) {
      setError("Failed to load protocols");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(protocols.map(p => p.category))];

  const filteredProtocols = protocols.filter(protocol => {
    const matchesCategory = selectedCategory === "All" || protocol.category === selectedCategory;
    const matchesSearch = protocol.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         protocol.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="loading">Loading protocols...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="protocols-container">
      <div className="protocols-header">
        <h2>Laboratory Protocols & Guidelines</h2>
        <p>Step-by-step procedures for biological analyses and experiments</p>
      </div>

      <div className="protocols-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search protocols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filter">
          <label>Filter by Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="protocols-grid">
        {filteredProtocols.map(protocol => (
          <ProtocolCard key={protocol.id} protocol={protocol} />
        ))}
      </div>

      {filteredProtocols.length === 0 && (
        <div className="no-protocols">
          <p>No protocols found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

const ProtocolCard: React.FC<{ protocol: Protocol }> = ({ protocol }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="protocol-card">
      <div className="protocol-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{protocol.title}</h3>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      <div className="protocol-meta">
        <span className="category-badge">{protocol.category}</span>
        <span className="steps-count">{protocol.steps.length} steps</span>
        <span className="author">By {protocol.created_by_name}</span>
      </div>

      <p className="protocol-description">{protocol.description}</p>

      {isExpanded && (
        <div className="protocol-steps">
          <h4>Procedure Steps:</h4>
          {protocol.steps.map((step, index) => (
            <div key={index} className="step">
              <div className="step-header">
                <span className="step-number">Step {step.stepNumber}</span>
                <strong className="step-title">{step.title}</strong>
                {step.duration && <span className="step-duration">⏱️ {step.duration}</span>}
              </div>
              <p className="step-description">{step.description}</p>
              
              {step.equipment && step.equipment.length > 0 && (
                <div className="step-equipment">
                  <strong>Equipment:</strong> {step.equipment.join(", ")}
                </div>
              )}
              
              {step.precautions && step.precautions.length > 0 && (
                <div className="step-precautions">
                  <strong>Precautions:</strong>
                  <ul>
                    {step.precautions.map((precaution, idx) => (
                      <li key={idx}>{precaution}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProtocolsList;