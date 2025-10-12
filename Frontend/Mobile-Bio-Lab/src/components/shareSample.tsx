// frontend/src/components/ShareSample.tsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import "../style/shareSample.css";

interface ShareSampleProps {
  sampleId?: string;
}

// Modal Component
const LinkModal: React.FC<{ 
  link: string; 
  onClose: () => void;
  onCopy: () => void;
}> = ({ link, onClose, onCopy }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Shareable Link Generated</h3>
        <div className="link-display-modal">
          {link}
        </div>
        <div className="modal-buttons">
          <button className="copy-button" onClick={onCopy}>
            Copy Link
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ShareSample: React.FC<ShareSampleProps> = ({ sampleId }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const resolvedId = sampleId || id!;

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Shared Sample Data");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);

  // Determine the correct URL based on current route
  const getShareableLink = () => {
    const baseUrl = window.location.origin;
    const currentPath = location.pathname;
    
    if (currentPath.includes('/dashboard/')) {
      return `${baseUrl}/dashboard/sample/${resolvedId}`;
    } else if (currentPath.includes('/user/')) {
      return `${baseUrl}/user/sample/${resolvedId}`;
    } else {
      return `${baseUrl}/sample/${resolvedId}`;
    }
  };

  const handleEmailShare = async () => {
    if (!email) {
      alert("Please enter recipient email");
      return;
    }

    if (!message.trim()) {
      alert("Please enter a message to share with the sample data");
      return;
    }

    setIsSending(true);
    try {
      await axios.post("http://localhost:5000/api/share/email", {
        to: email,
        subject: subject,
        message: message,
        sampleId: resolvedId,
      });
      alert("Email sent successfully!");
      setEmail("");
      setMessage("");
      setSubject("Shared Sample Data");
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const handleLinkShare = () => {
    const generatedLink = getShareableLink();
    setLink(generatedLink);
    setLinkGenerated(true);
    setShowModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
        setShowModal(false);
      })
      .catch(() => alert("Failed to copy link to clipboard"));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const copyInlineLink = () => {
    navigator.clipboard.writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(() => alert("Failed to copy link to clipboard"));
  };

  return (
    <div className="share-sample">
      <h4>Share Sample Data</h4>
      
      <div className="share-email">
        <h5>Share via Email</h5>
        <input
          type="email"
          placeholder="Enter recipient email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="share-input"
          required
        />
        <input
          type="text"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="share-input"
          required
        />
        <textarea
          placeholder="Enter your message to share with the sample data... (Required)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="share-textarea"
          rows={4}
          required
        />
        <div className="email-note">
          <small>
            <strong>Note:</strong> Your message above will be sent along with the complete sample data including Sample ID, collection details, geolocation, and field conditions.
          </small>
        </div>
        <button 
          onClick={handleEmailShare} 
          disabled={isSending}
          className="share-button"
        >
          {isSending ? "Sending..." : "Share via Email"}
        </button>
      </div>

      <div className="share-divider">
        <hr />
        <span>OR</span>
        <hr />
      </div>

      <div className="share-link">
        <h5>Generate Direct Link</h5>
        <button onClick={handleLinkShare} className="share-button">
          Generate & Copy Link
        </button>
        
        {/* Inline link display (appears on the page after generation) */}
        {linkGenerated && !showModal && (
          <div className="link-display-inline">
            <div className="link-message">
              <strong>✅ Your shareable link has been generated!</strong>
            </div>
            <div className="link-container">
              <input 
                type="text" 
                value={link} 
                readOnly 
                className="link-input"
                onClick={(e) => e.currentTarget.select()}
              />
              <button 
                onClick={copyInlineLink}
                className="copy-link-btn"
              >
                Copy Link
              </button>
            </div>
            <p className="link-instruction">
              Share this link with others to give them access to this sample data.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <LinkModal 
          link={link} 
          onClose={closeModal}
          onCopy={handleCopyLink}
        />
      )}
    </div>
  );
};

export default ShareSample;