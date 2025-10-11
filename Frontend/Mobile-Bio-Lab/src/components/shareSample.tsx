// frontend/src/components/ShareSample.tsx
import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../style/ShareSample.css";

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
  const resolvedId = sampleId || id!;

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Shared Sample Data");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleEmailShare = async () => {
    if (!email) {
      alert("Please enter recipient email");
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
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const handleLinkShare = () => {
    const generatedLink = `${window.location.origin}/dashboard/sample/${resolvedId}`;
    setLink(generatedLink);
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
          placeholder="Add a personal message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="share-textarea"
        />
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
        {link && !showModal && (
          <div className="link-display">
            <p>Share this link:</p>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
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