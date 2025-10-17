import React, { useState, useEffect } from "react";
import { getProtocols, createProtocol, updateProtocol, deleteProtocol, getMyProtocols } from "../services/protocolservice";
import type { Protocol, CreateProtocolData } from "../services/protocolservice";
import "../style/Protocol.css";

const AdminProtocols: React.FC = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<Protocol | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        let data;
        if (viewMode === 'my') {
          data = await getMyProtocols();
        } else {
          data = await getProtocols();
        }
        setProtocols(data);
      } catch (err) {
        console.error("Failed to load protocols:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocols();
  }, [viewMode]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this protocol?")) {
      try {
        await deleteProtocol(id);
        // Re-fetch protocols after deletion
        const data = viewMode === 'my' ? await getMyProtocols() : await getProtocols();
        setProtocols(data);
      } catch (err) {
        console.error("Failed to delete protocol:", err);
        alert("Failed to delete protocol");
      }
    }
  };

  // Function to refresh protocols (used after form save)
  const refreshProtocols = async () => {
    setLoading(true);
    try {
      const data = viewMode === 'my' ? await getMyProtocols() : await getProtocols();
      setProtocols(data);
    } catch (err) {
      console.error("Failed to load protocols:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading protocols...</div>;

  return (
    <div className="admin-protocols">
      <div className="admin-header">
        <h2>Manage Protocols</h2>
        <div className="admin-controls">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => setViewMode('all')}
            >
              All Protocols
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'my' ? 'active' : ''}`}
              onClick={() => setViewMode('my')}
            >
              My Protocols
            </button>
          </div>
          <button 
            className="btn-primary"
            onClick={() => {
              setEditingProtocol(null);
              setShowForm(true);
            }}
          >
            + Add New Protocol
          </button>
        </div>
      </div>

      {showForm && (
        <ProtocolForm
          protocol={editingProtocol}
          onSave={() => {
            setShowForm(false);
            setEditingProtocol(null);
            refreshProtocols();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingProtocol(null);
          }}
        />
      )}

      <div className="protocols-list">
        {protocols.map(protocol => (
          <div key={protocol.id} className="protocol-item">
            <div className="protocol-info">
              <h3>{protocol.title}</h3>
              <p className="category">{protocol.category}</p>
              <p>{protocol.description}</p>
              <div className="protocol-meta">
                <span className="steps">{protocol.steps.length} steps</span>
                <span className="author">By {protocol.created_by_name}</span>
                <span className="created-date">
                  Created: {new Date(protocol.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="protocol-actions">
              <button 
                className="btn-edit"
                onClick={() => {
                  setEditingProtocol(protocol);
                  setShowForm(true);
                }}
              >
                Edit
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDelete(protocol.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {protocols.length === 0 && (
        <div className="no-protocols">
          <p>No protocols found.</p>
        </div>
      )}
    </div>
  );
};

// ... ProtocolForm component remains the same ...
const ProtocolForm: React.FC<{
  protocol: Protocol | null;
  onSave: () => void;
  onCancel: () => void;
}> = ({ protocol, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: protocol?.title || "",
    description: protocol?.description || "",
    category: protocol?.category || "",
    steps: protocol?.steps || [{ stepNumber: 1, title: "", description: "" }]
  });
  const [saving, setSaving] = useState(false);

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        { stepNumber: prev.steps.length + 1, title: "", description: "" }
      ]
    }));
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index).map((step, idx) => ({
          ...step,
          stepNumber: idx + 1
        }))
      }));
    }
  };

  const updateStep = (index: number, field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const protocolData: CreateProtocolData = {
        ...formData
      };

      if (protocol) {
        await updateProtocol(protocol.id, protocolData);
      } else {
        await createProtocol(protocolData);
      }
      
      onSave();
    } catch (err) {
      console.error("Failed to save protocol:", err);
      alert("Failed to save protocol");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="protocol-form-overlay">
      <div className="protocol-form">
        <h3>{protocol ? "Edit Protocol" : "Create New Protocol"}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., DNA Extraction, Cell Culture, PCR"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="steps-section">
            <div className="steps-header">
              <h4>Procedure Steps</h4>
              <button type="button" onClick={addStep} className="btn-add-step">
                + Add Step
              </button>
            </div>

            {formData.steps.map((step, index) => (
              <div key={index} className="step-form">
                <div className="step-header">
                  <h5>Step {step.stepNumber}</h5>
                  {formData.steps.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeStep(index)}
                      className="btn-remove-step"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Step Title *</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(index, "title", e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(index, "description", e.target.value)}
                    required
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Duration (optional)</label>
                  <input
                    type="text"
                    value={step.duration || ""}
                    onChange={(e) => updateStep(index, "duration", e.target.value)}
                    placeholder="e.g., 30 minutes, 2 hours"
                  />
                </div>

                <div className="form-group">
                  <label>Equipment (optional, comma separated)</label>
                  <input
                    type="text"
                    value={step.equipment?.join(", ") || ""}
                    onChange={(e) => updateStep(index, "equipment", e.target.value.split(",").map(item => item.trim()))}
                    placeholder="e.g., Microcentrifuge, Pipettes, Thermal Cycler"
                  />
                </div>

                <div className="form-group">
                  <label>Precautions (optional, one per line)</label>
                  <textarea
                    value={step.precautions?.join("\n") || ""}
                    onChange={(e) => updateStep(index, "precautions", e.target.value.split("\n").filter(line => line.trim()))}
                    placeholder="Enter each precaution on a new line"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : protocol ? "Update Protocol" : "Create Protocol"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProtocols;